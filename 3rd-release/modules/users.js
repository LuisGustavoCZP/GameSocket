import database from '../database/database.js'
import { encrypt, decrypt } from './crypto.js';

async function get(id)
{
    const resp = await database.get("user", id);//database.query('SELECT * FROM public.user WHERE public.user.id=$1', [id]).catch(err => { return undefined; });
    if(!resp) return undefined;
    return resp;
};

async function search(username)
{
    const resp = await database.select("user", "username", username);//database.query('SELECT * FROM public.user WHERE public.user.username=$1', [username]).catch(err => { return undefined; });
    if(!resp) return undefined;
    return resp[0];
};

async function create (username, password) 
{
    if(!username) return -3;
    if(!password) return -2;
    if(await search(username) != undefined) return -1;

    password = encrypt(password);
    const resp = await database.insert("user", {username, password})//database.query('INSERT INTO public.user (username, password) VALUES ($1, $2) RETURNING id', [username, password])
    .then(res => 
    {
        return {sucess:true, content:res};
    })
    .catch(err => 
    { 
        return {sucess:false, content:err}; 
    });

    if(resp.sucess) 
    {
        //console.log("Can't select because", resp.content.rows);
        return resp.content.id;
    }

    console.log("Can't create because", resp);
    return -4;
};

async function remove (id) 
{
    
};

async function check (username, password)
{
    const user = await search(username);
    if(!user) return -1;
    //console.log("Found user:", user);
    const userpass = user.password;
    if(decrypt(userpass) !== password) return -2;
    return user.id;
};

export default {
    get,
    search,
    create,
    remove,
    check,
};