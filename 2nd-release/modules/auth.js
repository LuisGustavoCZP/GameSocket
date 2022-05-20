import database from '../database/database.js';

function register (req, res)
{
    const { username, userpass } = req.body;
    const id = database.users.create(username, userpass);
    create(id, res);
    res.json(id);
}

function login (req, res)
{
    console.log(req.body);
    const { username, userpass } = req.body;
    if(username && userpass)
    {
        const id = database.users.check(username, userpass);
        create(id, res);
        res.json(id);
    }
    else 
    {
        res.json(false);
    }
}

function load (req, res) 
{
    const {token} = req.cookies;
    console.log(token);
    if(check(token)) 
    {
        res.json(token);
    } else {
        res.cookie("token", '', {maxAge:1, path:"/"});
        res.json(undefined);
    }
}

function create (token, res)
{
    if(token == -1 || token == -2) return;
    res.cookie("token", token, {maxAge:1000*60*60*24, path:"/"});
}

function check (token)
{
    const user = database.users.get(token);
    if(token < 0) return undefined;
    return user;
}

export default {
    register,
    login,
    load,
    check
}