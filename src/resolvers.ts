import { MyContext, processQuery } from './utils'
import { dateScalar } from '../models/dateScalar';
import { Op } from 'sequelize';
import { category } from '../models/models/category';
import { data } from '../models/models.ts/data';

export const resolvers = {
  Date: dateScalar,
  Query: {
    //data(safename: String): Data
    async data(root: any, param: { safename: string[], limit?: number }, { models, query }: MyContext) {
      const { safename = [], limit = 1000 } = param;
      const { include } = processQuery(query, models.data, 'data')
      return models.data.findAll({
        include,
        where: { safename: { [Op.in]: safename } },
        order: [
          ["created", "ASC"],
        ], ...(() => { return limit === 1 ? { group: 'data.id' } : {} })()
      });
    },
    //categories
    async categories(root: any, param: {}, { models, query }: MyContext) {
      // const {  } = param;
      const { include } = processQuery(query, models.category, 'categories')
      return models.category.findAll({
        include,
        where: { [Op.and]: [{ '$data.id$': { [Op.gte]: 0 } }, { [Op.or]: [{ '$data.sells_items.data_id$': { [Op.is]: null } }, { '$`data->sells_items->sell`.`done`$': { [Op.ne]: 1 } }] }] },
        order: [
          ["sort", "ASC"],
        ], group: 'data.id'
      });
    },
    //category
    async category(root: any, param: { categorySafename: string[], limit?: number }, { models, query }: MyContext) {
      const { categorySafename = [], limit = 1000 } = param
      const { include } = processQuery(query, models.category, 'category')
      const offered = { [Op.or]: [{ '$data.sells_items.data_id$': { [Op.is]: null } }, { '$`data->sells_items->sell`.`done`$': { [Op.ne]: 1 } }] }
      const chosen = {[Op.and]: [{ safename: { [Op.in]: categorySafename } }, offered ]}
      const sold = { '$`data->sells_items->sell`.`done`$': { [Op.eq]: 1 } }
      let lookfor = categorySafename.includes('prodano') ? sold : categorySafename.includes('vse') ? offered : chosen 

      let ret = await models.category.findAll({
        include,
        where: lookfor,
        order: [
          [models.data, 'created', 'DESC']
        ], ...(() => { return limit === 1 ? { group: 'data.id' } : {} })()
      });

      if(categorySafename.includes('vse') || categorySafename.includes('prodano')) return [{safename: categorySafename.includes('prodano') ? 'prodano' : 'vse', data: (() => {const dat: data[] = []; ret.forEach((i: any) => {if(i.dataValues){ i.dataValues.data.map((j:data) => dat.push(j))}}); dat.sort((a:any,b:any) => (b.created - a.created) ); return dat;})()} as unknown as category];
      return ret
    },
    //find(expr: String, limit: Int): [Data]
    async find(root: any, param: { expr: string, limit?: number }, { models, query }: MyContext) {
      const { expr = '', limit = 1000 } = param
      if (expr.trim().length === 0) return null;
      const find = `%${expr}%`
      const { include } = processQuery(query, models.data, 'find')
      return models.data.findAll({
        include,
        where: { [Op.and]: [{ [Op.or]: [{'name': {[Op.like]: find}}, {'text': {[Op.like]: find}}]}, { [Op.or]: [{ '$sells_items.data_id$': { [Op.is]: null } }, { '$`sells_items->sell`.`done`$': { [Op.ne]: 1 } }] }] },
        order: [
          ["created", "ASC"],
        ], ...(() => { return limit === 1 ? { group: 'data.id' } : {} })()
      });
    },
    //image(dataSafename: String): [Image]
    async image(root: any, param: { dataSafename: string[], limit?: number }, { models, query }: MyContext) {
      const { dataSafename = [], limit = 1000 } = param;
      return models.image.findAll({
        include: [{ model: models.data, as: 'datum', on: { id: { [Op.col]: 'data_id' } }, required: true, where: { safename: { [Op.in]: dataSafename } } }],
        order: [
          ["id", "ASC"],
        ], ...(() => { return limit === 1 ? { group: 'data_id' } : {} })()
      });
    },
    //homepage: [Homepage]
    async homepage(root: any, param: any, { models, query }: MyContext) {
      const { include } = processQuery(query, models.homepage, 'homepage')
      return models.homepage.findAll({
        include,
        order: [
          ["sort", "ASC"],
        ], group: 'datum.id'
      });
    },
    //delivery: [Delivery]
    async delivery(root: any, param: any, { models, query }: MyContext) {
      const { include } = processQuery(query, models.delivery, 'delivery')
      return models.delivery.findAll({
        include,
        group: 'size_id',
        where: {valid_to: {[Op.is]: null}},
        order: [['size_id', 'ASC']]
      });
    }
  },

  Mutation: {
    //addToBasket(itemId: Int): Int
    async addToBasket(root: any, param: { id: number }, { models, user_id }: MyContext) {
      const { id } = param;
      return await models.basket.create({ data_id: id, })
    },
  }
};