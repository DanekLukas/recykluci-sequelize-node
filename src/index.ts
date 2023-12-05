import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { expressMiddleware } from '@apollo/server/express4';
import express from 'express';
import { createClient } from 'redis'
import { AccessDeniedError } from 'sequelize';
import { models } from '../models';
import https from 'https';
import http from 'http';
import * as fs from 'fs';
import * as path from 'path';
import { MyContext, passwordHash, processQuery } from './utils'
import { typeDefs } from './schema';
import { resolvers } from './resolvers';
import cors from 'cors';
import { graphqlUploadExpress } from 'graphql-upload-ts';
import 'dotenv/config'
import { Op } from 'sequelize';
import sharp from 'sharp';

const port = process.env.PORT || 6000
const graphql = process.env.FOLD || 'graphql'
const salt = process.env.SALT || 'a7b8345d821e43d8956e78f89AD1900de8764329fd8e7f2'
const images = process.env.IMAGES || '.images'
const data = process.env.STATIC || 'public'
const image = process.env.IMAGE || 'image'
const indexfile = process.env.HOMEPAGE || 'homepage.html'

const run = async () => {

    const app = express();

    const redisClient = createClient();

    redisClient.on('error', err => console.log('Redis Client Error', err));

    await redisClient.connect();

    const notAuthorized = (res: express.Response) => {
        res.status(401).send('not authorized');
        throw AccessDeniedError
    }

    app.use(express.static(data))

    const s = (process.env.HTTPS?.toUpperCase() === 'TRUE') &&
        process.env.KEY &&
        fs.existsSync(process.env.KEY) &&
        process.env.CERT &&
        fs.existsSync(process.env.CERT) ? 's' : '';
    const httpsServer = s.length > 0 ?
        https.createServer(
            {
                // @ts-ignore
                key: fs.readFileSync(process.env.KEY),
                // @ts-ignore
                cert: fs.readFileSync(process.env.CERT),
            },
            app) : http.createServer(app);

    const getUser = async (condition: { [index: string]: string | number | Date }) => {
        return models.user.findOne({
            where: condition,
            raw: true,
        });
    }

    const checkAuthorization = async (req: express.Request) => {
        const bearer = 'Bearer '
        let { authorization = '' } = req.headers;
        if (!authorization.startsWith(bearer))
            return null;
        const { id } = JSON.parse(await redisClient.get(authorization.substring(bearer.length)) || '{"id":null}');
        return id;
        //   const splited = authorization.split('.');
        //   if (splited.length === 3) {
        //     const condition = JSON.parse(Buffer.from(splited[1], 'base64').toString('utf8'));
        //     user = await getUser({ username: condition.name });
        //     if (user && !verify(authorization, user.salt!)) {
        //       user = null;
        //     }
        //   }
        // }
        // return user;
    }

    const admincontext = async ({ req, res }: { req: express.Request, res: express.Response }) => {

        let user_id = await checkAuthorization(req);

        if (req.body.operationName === 'login' && req.body.variables.name && req.body.variables.password) {
            const username = req.body.variables.name
            const password = req.body.variables.password;
            const user = await getUser({ username_canonical: username });
            if (user) {
                if (passwordHash(password, salt!) !== user.password) {
                    user_id = null;
                }
                else {
                    user_id = user.id;
                }
            }
        }

        if (!user_id) notAuthorized(res);
        // Add the user to the context
        return { user_id, models, query: req.body.query, redis: redisClient };
    }

    const context = async ({ req, res }: { req: express.Request, res: express.Response }) => {

        return { user_id: null, models, query: req.body.query, redis: redisClient };
    }

    // @ts-ignore
    const server = new ApolloServer<MyContext>({
        typeDefs,
        resolvers,
        plugins: [ApolloServerPluginDrainHttpServer({ httpServer: httpsServer })],
    });

    await server.start();

    app.get(`/${image}/*`, (req, res, next) => {
        next()
    }, async (req, res) => {
        const im = req.path.split(`/${image}/`)[1].split('_')
        if(im.length < 4) res.send('wrong file');
        const id = parseInt(im.shift()!,10);
        const width = parseInt(im.shift()!, 10);
        const height = parseInt(im.shift()!, 10);
        const img = await models.image.findByPk(id);
        let name = im.join('_');
        name = name.substring(0, name.lastIndexOf('.'))
        if(img?.name?.substring(0, img?.name?.lastIndexOf('.'))!==name) res.send('wrong file')
        const filePath = path.join(__dirname, '..', images, `${img?.id}_${img?.name!.substring(0, img?.name?.lastIndexOf('.'))}.${img?.mime?.split('/').pop()}`)
        const folder = path.join(__dirname, '..', data, image)
        if(!fs.existsSync(folder)) fs.mkdirSync(folder)
        sharp(filePath)
        .resize({ width })
        .toBuffer()
        .then(data => {
          res.send(data);
        });
        sharp(filePath)
        .resize({ width })
        .toFile(path.join(__dirname, '..', data, req.path));
    })

    app.get('/*', (req, res, next) => {
        next()
    }, async (req, res) => {
        const home = fs.readFileSync(path.join(__dirname, '..', data, indexfile));
        const index = home.toString('utf8');
        const homeQuery = `{
            homepage {
              datum {
                name
                safename
                price
                category {
                  name
                  safename
                }
                id_image {
                  imageName
                }
                baskets {
                  date
                }
                sells_items {
                  sell {
                    done
                  }
                }
              }
            }
          }`;
        let { include } = processQuery(homeQuery, models.homepage, 'homepage')
        const separator = '<title>'
        const sep = '<h1>'
        const tab = "\n        ";
        const homepage = {homepage:(await models.homepage.findAll({
            include,
            order: [
                ["sort", "ASC"],
            ]
        })).map(i => ({ name: i.datum.name, safename: i.datum.safename, price: i.datum.price, category: { name: i.datum.category.name, safename: i.datum.category.safename }, id_image: { imageName: i.datum.id_image.imageName }, baskets: i.datum.baskets.map(k => ({ date: k.date })), sells_items: i.datum.sells_items.map(l => ({ sell: { done: l.sell?.done } })) }))};
        const routeQuery = `{
            categories {
              name
              safename
              data {
                name
                safename
                price
                created
                id_image {
                  imageName
                }
                baskets {
                  date
                }
                sells_items {
                  sell {
                    done
                  }
                }
              }
            }
          }`;
        include = processQuery(routeQuery, models.category, 'categories').include;
        const route = {routes:(await models.category.findAll({
            include,
            where: { [Op.and]: [{ '$data.id$': { [Op.gte]: 0 } }, { [Op.or]: [{ '$data.sells_items.data_id$': { [Op.is]: null } }, { '$`data->sells_items->sell`.`done`$': { [Op.ne]: 1 } }] }] },
            order: [
                ["sort", "ASC"],
            ], group: 'data.id'
        })).map(i => ({ name: i.name, safename: i.safename, data: i.data.map(k => ({ name: k.name, safename: k.safename, price: k.price, created: k.created, id_image: { imageName: k.id_image.imageName }, baskets: k.baskets.map(k => ({ date: k.date })), sells_items: k.sells_items.map(l => ({ sell: { done: l.sell?.done } })) }))}))};
        const deliveryQuery = `{
            delivery {
              id
              name
              type
              price
              cod
              inc
              size_id
            }
          }`
          const processed = processQuery(deliveryQuery, models.delivery, 'delivery');
          const delivery = {delivery: await models.delivery.findAll({
            attributes: processed.attributes,
            include: processed.include,
            group: 'size_id',
            where: {valid_to: {[Op.is]: null}},
            order: [['size_id', 'ASC']]
            })};
          const get = req.path.split('/', 3);
        if (get.length > 2) { }
        const splited = index.split(separator, 2);
        const spl = splited[1].split(sep, 2);
        const category = {category: [{name:'Vše', safename: 'vse'}].concat(route.routes.map(i => ({name: i.name, safename: i.safename}))).concat({name: 'Prodáno', safename: 'prodano'})}
        res.send([splited[0], '<script id="start" type="text/script">', tab, ' const homepage=', JSON.stringify(homepage), tab, ' const routes=', JSON.stringify(route), tab, ' const delivery=', JSON.stringify(delivery), tab, ' const category=', JSON.stringify(category), tab, '</script>', tab, separator, spl[0], req.path, sep, spl[1]].join(''));
    });

    app.use(graphqlUploadExpress());

    app.use(
        `/${graphql}`,
        cors<cors.CorsRequest>(),
        express.json(),
        expressMiddleware(server as any, { context }),
    );


    app.use(
        `/${graphql}/admin`,
        cors<cors.CorsRequest>(),
        express.json(),
        expressMiddleware(server as any, { context: admincontext }),
    );

    await new Promise<void>((resolve) => httpsServer.listen({ port }, resolve));
    console.log(`🚀 Server ready at http${s}://localhost:${port}/${graphql}`);
}

run();