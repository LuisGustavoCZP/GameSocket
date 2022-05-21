import users from '../database/users.js';

async function register (req, res)
{
    const { username, userpass } = req.body;
    const id = await users.create(username, userpass);
    if(!(id < 0)) {
        await create(id, res);
    } 
    res.json(id);
}

async function login (req, res)
{
    //console.log(req.body);
    const { username, userpass } = req.body;
    if(username && userpass)
    {
        const id = await users.check(username, userpass);
        await create(id, res);
        res.json(id);
    }
    else 
    {
        res.json(false);
    }
}

async function load (req, res) 
{
    const {token} = req.cookies;
    //console.log(token);
    if(await check(token)) 
    {
        res.json(token);
    } else {
        res.cookie("token", '', {maxAge:1, path:"/"});
        res.json(undefined);
    }
}

async function create (token, res)
{
    console.log(token)
    if(token == -1 || token == -2) return;
    res.cookie("token", `${token}`, {maxAge:1000*60*60*24, path:"/"});
}

async function check (token)
{
    const user = await users.get(token);
    return user;
}

export default {
    register,
    login,
    load,
    check
}