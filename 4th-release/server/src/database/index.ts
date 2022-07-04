import fs from 'fs';
import fsasync from 'fs/promises';
import { v4 } from 'uuid';

class Database 
{
    private root = `./data`;
    private data = new Map();

    constructor () 
    {
        if(!fs.existsSync(this.root))
        {
            fs.mkdirSync(this.root)
        }
        const dataTables = fs.readdirSync(this.root);
        dataTables.forEach(dataTable => {
            const table = new Map();
            this.data.set(dataTable, table);
            dataTable = `${this.root}/${dataTable}`;
            const tableFiles = fs.readdirSync(dataTable);
            tableFiles.forEach(tableFile => 
            {
                const fileText = fs.readFileSync(`${dataTable}/${tableFile}`, 'utf8');
                const obj = JSON.parse(fileText);
                table.set(obj.id, obj);
            });
        });
    }

    async table (name : string) : Promise<Map<string, any>>
    {
        return this.data.has(name) ? this.data.get(name) : null
    } 

    async list (table: string) : Promise<any[]>
    {
        const t = await this.table(table);
        return t?Array(...t.values()):[];
    }

    async get (table: string, id: string) : Promise<any>
    {
        if(this.data.has(table)) return this.data.get(table).get(id);
        else return undefined;
    }

    async select (table: string, attributes : any) : Promise<any[]>
    {
        const array = await this.list(table);
        //console.log(`Array ${table} \n`, array);
        //const atts = Object.keys(attributes);
        return array.filter(element => 
        {
            for (const key in attributes)
            {
                if(element[key] != attributes[key]) return false;
            }
            return true;
        }) || [];
    }

    async insert (table: string, object : any) : Promise<any>
    {
        const id = v4();
        object.id = id;
        if(!this.data.has(table))
        {
            this.data.set(table, new Map());
        }
        this.data.get(table).set(id, object);
        const p = `${this.root}/${table}`;
        if(!fs.existsSync(p))
        {
            fsasync.mkdir(p);
        }
        fsasync.writeFile(`${p}/${id}.json`, JSON.stringify(object, null, '\t'));
        return object;
    }

    async update (table: string, id: string, info: any)
    {
        if(!this.data.has(table))
        {
            this.data.set(table, new Map());
        }
        const obj = await this.get(table, id);
        for (const k in info)
        {
            obj[k] = info[k];
        }

        const p = `${this.root}/${table}`;
        if(!fs.existsSync(p))
        {
            fsasync.mkdir(p);
        }
        fsasync.writeFile(`${p}/${id}.json`, JSON.stringify(obj, null, '\t'));
        return obj;
    }

    async remove (table: string, id: string)
    {
        const t = await this.table(table);
        if(t)
        {
            t.delete(id);
        }
        const p = `${this.root}/${table}`;
        fsasync.rm(`${p}/${id}.json`);
    }
}

export default new Database();