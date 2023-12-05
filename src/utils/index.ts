import { createHash } from "crypto";
import { models } from '../../models';
import gql from 'graphql-tag';
import { RedisClientType } from 'redis'
import { Op } from "sequelize";

export interface MyContext {
    models: typeof models;
    redis: RedisClientType
    user_id: number;
    query: string;
}

// export const registerSpliceOnString = () => {
// if (String.prototype.splice === undefined) {
//     /**
//      * Splices text within a string.
//      * @param {int} offset The position to insert the text at (before)
//      * @param {string} text The text to insert
//      * @param {int} [removeCount=0] An optional number of characters to overwrite
//      * @returns {string} A modified string containing the spliced text.
//      */
//     String.prototype.splice = function(offset, text, removeCount=0) {
//       let calculatedOffset = offset < 0 ? this.length + offset : offset;
//       return this.substring(0, calculatedOffset) +
//         text + this.substring(calculatedOffset + removeCount);
//     };
//   }
// }

export const passwordHash = (password: string, salt: string, iterations = 5000) => {
    const salted = `${password}{${salt}}`;
    let pass = createHash('sha512').update(salted, 'binary');
    const work = () => {
        for (let i = 1; i < iterations; i++) {
            pass = createHash("sha512").update(`${pass.digest('binary')}${salted}`, 'binary');
        }
        return pass;
    }
    return work().digest('base64')
}

type TJoin = { [index: string]: { [index: string]: any } };
type TIncludes = { include?: TIncludes[], model?: any, as?: string, right?: boolean } & TJoin;

export const processQuery = (query: string, passedModel: any, caller: string = '') => {
    const attributes: Array<string[] | string> = [];

    let include: any = []


    const flattern = (include: any) => {
        while (Array.isArray(include) && include.length === 1) include = include[0];
        return include;
    }

    const getAssociationProperty = (model: any, name: string, property: string) => {
        if (!Array.isArray(Object.entries(model.associations).find(l => l[0] === name))) return undefined;
        return (Object.entries((Object.entries(model.associations).find(l => l[0] === name) as any)[1]).find(k => k[0] === property) as any)[1];
    }

    const getModel = (name: string, model: any) => {
        const a: any = Object.entries(model.getAttributes()).find((i: any) => (i[1].fieldName.endsWith('_id') ? i[1].fieldName.slice(0, -3) : i[1].fieldName) === name);
        if (a && a.length > 1) {
            const fn = a[1].fieldName;
            return fn.endsWith('_id') ? a[1].references.model : fn;
        }
        const b: any = (Object.entries(model.getAttributes()).find((i: any) => (i[1].fieldName === `${name}_id`)));

        if (b && b.length > 1) {
            const fn = b[1].fieldName;
            return fn.endsWith('_id') ? b[1].references.model : fn;
        }
        if (name !== passedModel.getTableName()) {
            const retval = getAssociationProperty(model, name, 'target')?.getTableName();
            if (retval) return retval;
            const shorted = name.substring(0, name.length - 1);
            if (Object.keys(models).includes(shorted))
                return shorted;
        }
        return name;
    }

    const addJoin = (a: any, base: string): TJoin => {
        if (a.name.value === 'id_image') {
            return { on: { data_id: { [Op.col]: `${base}id` } } }
        }
        // if(a.name.value === 'sells_items') {
        //     return { where: { '$sell.done$': {[Op.eq]: 1}}, '$sells_items.data_id$': {[Op.gte]: 0}}
        // }
        // if(a.name.value === 'sell') {
        //     return { where: { sell: 1 }
        // }
        return {}
    }

    const level = (a: any, addTo: string, prev: any, upperModel: any, includes: TIncludes[]) => {
        let model = upperModel
        if(typeof a === 'undefined') return
        if (a.selectionSet?.kind === 'SelectionSet') {
            if (a.name?.value) {

                const modelName = getModel(a.name.value, model);
                if (model.getTableName() !== modelName) {
                    if (passedModel.getTableName() === model.getTableName() && models[modelName as keyof typeof models]) {
                        includes.push({ model: models[modelName as keyof typeof models], as: a.name.value, ...addJoin(a, addTo) })
                    }
                    else {
                        const found = includes.find((i: TIncludes) => i.as === model.getTableName())! || { include: [] };
                        if (models[modelName as keyof typeof models]) {
                            found.include!.push({ model: models[modelName as keyof typeof models], as: a.name.value, ...addJoin(a, addTo) })
                            includes.push(found)
                        }
                    }
                }
                prev = model
                model = models[modelName as keyof typeof models] || prev
            }
            for (let i = 0; i < a.selectionSet.selections.length; i++) {
                const got = level(a.selectionSet.selections[i], `${addTo.length === 0 ? passedModel.getTableName() : a.name?.value}.`, prev, model, []);
                // console.log(got.length > 0 ? got[0].include : null, model)
                if (Array.isArray(got) && got.length > 0)
                    if ((includes.length > 0) && !(got.length === 1 && Object.keys(got[0]).length === 1)) {
                        const n: any = includes.find(i => i && i.model && i.model.getTableName() === model.getTableName())

                        if (got.length > 0)
                            if (n)
                                n.include = !n.include ? got : n.include.concat(got);
                            else
                                includes = includes.concat(got)

                    }
                    else {
                        if (!(got.length === 1 && Object.keys(got[0]).length === 1 && got[0].include?.length === 0)) {
                            const flatternedGot = got.length === 1 && Object.keys(got[0]).length === 1 ? got[0]! : got as any;
                            includes.forEach(i => {
                                const tn = i.model;
                                // console.log(i)
                                // (Array.isArray(flatternedGot) ? flatternedGot : [flatternedGot]).
                                //     filter(i => Array.isArray(i.include)).forEach(l => { l.include.forEach((k: any) => { console.log(k.model, k.as) }) })
                            })
                            if (flatternedGot.hasOwnProperty('include')) {
                                let found = includes.find((i: TIncludes) => i?.hasOwnProperty('model') || false);
                                if (found)
                                    found.include = found.include ? found.include.concat(flatternedGot.include) : flatternedGot.include;
                                else
                                    if(includes[0]?.include) {
                                        includes[0].include[0].include = includes[0].include[0].include ? includes[0].include[0].include.concat(flatternedGot.include) : flatternedGot.include
                                    }
                            }
                            else
                                includes.push(flattern(flatternedGot));
                        }
                    };
            }
        }
        else
            attributes.push(`${addTo === `${passedModel.getTableName()}.` ? '' : addTo}${a.name?.value}`)
        // console.log(includes.length > 0 ? includes[0] : null)
        return includes
    }


    // registerSpliceOnString();
    // const lookFor = 'data {';
    // const index = query.indexOf(lookFor);
    // if(index !== -1) {
    //   query = query.splice(index + lookFor.length, `
    //   sells_items {
    //     sell {
    //         done
    //     }
    //   }`)
    // }

    const getDeeper = (que) => {
        for (let i = 0; i < que.definitions.length; i++) {
            let a = que.definitions[i] as any
            if (a.operation === 'query') {
                if (a.kind === 'OperationDefinition') {
                    if (a.operation === 'query' && a.selectionSet.kind === 'SelectionSet') {
                        include = level(a.selectionSet.selections.find((i: any) => i.name.value === caller), '', passedModel, passedModel, [])
                    }
                    else {
                        include = a.selectionSet.selections.map((i: any) =>
                            level(i, '', passedModel, passedModel, []))
                    }
                }
                else
                    include = level(a, '', passedModel, passedModel, [])
            }
        }
    }

    const que = gql(query);

    getDeeper(que)

    return { attributes, include: flattern(include) }
}

export const getLast = <Type>(elm: Type, name: string): void => {
    if (!elm[name as keyof typeof elm]) return;
    const splited = (elm[name as keyof typeof elm] as string).split(':');
    if (splited.length < 2) return;
    const n = parseInt(splited[splited.length - 2]);
    if (typeof n !== 'number') return;
    (elm[name as keyof typeof elm] as string) = Buffer.from(splited[splited.length - 1], 'utf-8').subarray(1, 1 + n).toString();
}