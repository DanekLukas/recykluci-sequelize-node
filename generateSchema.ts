import { models } from './models';
import fs from 'fs'

const convert: { [index: string]: string } = {
    BIGINT: 'Int',
    SMALLINT: 'Int',
    DECIMAL: 'Int',
    INTEGER: 'Int',
    BLOB: 'String',
    TEXT: 'String',
    DATETIME: 'Date',
    DATE: 'Date',
    TIMESTAMP: 'Date',
    STRING: 'String',
    BOOLEAN: 'Boolean',
    TINYINT: 'Boolean',
    VARCHAR: 'String',
    FLOAT: 'Float',
    DOUBLE: 'Float'
}
const fstUpper = (name: string) => name[0].toUpperCase() + (name as any).slice(1)
const toCamel = (name: string) => (name.split('_').map(i => fstUpper(i))).join('');
const ret:{[index:string]: string[]} = {};
Object.values(models).forEach((model: any) => {
    const tn = model.getTableName() as string;
    const idx = toCamel(tn);
    ret[idx]=[]
    let add = '!';
    Object.entries(model.getAttributes()).forEach((i: any) => {
        ret[idx].push(`  ${i[0]}: ${convert[i[1].type.toString({}).split('(')[0].trim().split(' ')[0]]}${add}`)
        add=''
    })
    const file = `./models/models/${tn}.ts`
        if (fs.existsSync(file)) {
            const stats = fs.readFileSync(file);
                let n = false;
                stats.toString().split('\n').forEach(l => {
                    if(n) {
                    const spl = l.split('!: ');
                    if (l.endsWith('[];'))
                        ret[idx].push(`${spl[0]}: [${toCamel(spl[1].slice(0, -3))}]`);
                    else
                        ret[idx].push(`${spl[0]}: ${toCamel(spl[1].slice(0,-1))}`);
                    }
                    n = l.trim().startsWith('//');
                });
            
        }        
})

Object.entries(ret).map(i => {console.log(`type ${i[0]} {`); i[1].forEach(j => console.log(j)); console.log('}\n')})