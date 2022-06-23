import fs from 'fs';
import fsasync from 'fs/promises';
import { encrypt, decrypt, uuid } from '../modules/crypto.js';

const root = `database/data`;
const data = {};

function start () 
{
    const dataTables = fs.readdirSync(root);
    dataTables.forEach(dataTable => {
        const table = {};
        data[dataTable] = table;
        dataTable = `${root}/${dataTable}`;
        const tableFiles = fs.readdirSync(dataTable);
        tableFiles.forEach(tableFile => 
        {
            const fileText = fs.readFileSync(`${dataTable}/${tableFile}`);
            const obj = JSON.parse(fileText);
            table[obj.id] = obj;
        });
    });
    console.log(Object.keys(data));
}

async function list (table)
{
    return data[table]?Object.values(data[table]):[];
}

async function get (table, id)
{
    return data[table][id];
}

async function select (table, attribute, value)
{
    const array = await list(table);
    return array.filter(element => element[attribute] == value) || [];
}

async function insert (table, object)
{
    const id = uuid();
    object.id = id;
    data[table][id] = object;
    fsasync.writeFile(`${root}/${table}/${id}.json`, JSON.stringify(object), null, '\t');
    return object;
}

async function update (table, id, info)
{
    const obj = data[table][id];
    for (const k in info)
    {
        obj[k] = info[k];
    }
    
    fsasync.writeFile(`${root}/${table}/${id}.json`, JSON.stringify(obj), null, '\t');
    return obj;
}

async function remove (table, id)
{

}

start ();
export default {list, get, select, insert, remove, update};