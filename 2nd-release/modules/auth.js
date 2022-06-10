import users from '../database/users.js';
import database from '../database/database.js'
import {uuid} from './crypto.js'

//Expiration of session in secounds
const session_expiration = 5*60;

async function register (req, res)
{
    const { username, userpass } = req.body;
    const id = await users.create(username, userpass);
    if(!(id < 0)) 
    {
        const sessionId = await createCookie(id, res);
        console.log(sessionId);
        if(sessionId){
            res.json(sessionId);
            return;
        }
    } 
    res.json(undefined);
}

async function login (req, res)
{
    //console.log(req.body);
    const { username, userpass } = req.body;
    if(username && userpass)
    {
        const id = await users.check(username, userpass);
        const sessionId = await createCookie(id, res);
        console.log("login", sessionId);
        if(sessionId){
            res.json(sessionId);
            return;
        }
    }

    res.json(undefined);
}

async function load (req, res) 
{
    const {token} = req.cookies;
    if(token) {
        console.log("Loading session: ", token)
        
        const session = await check(token);
        //console.log(token);
        if(session) 
        {
            //console.log(session);
            res.json(session);
            return;
        }
        
    }

    res.cookie("token", '', {maxAge:1, path:"/"});
    res.json(undefined);
}

async function token (req, res, next) 
{
    const {token} = req.cookies;
    if(token) {
        //console.log("Loading session: ", token)
        
        const session = await check(token);
        //console.log(token);
        if(session) 
        {
            //console.log(session);
            req.session = session;
            next();
            return;
        }
    }

    res.cookie("token", '', {maxAge:1, path:"/"});
    res.end();
}

async function createCookie (userid, res)
{
    //console.log(userid)
    if(userid == -1 || userid == -2) return undefined;

    const resp = await database.query('INSERT INTO public.session (id, id_user, expire_time) VALUES ($1, $2, (to_timestamp($3 / 1000.0)+$4)) RETURNING *', [uuid(), userid, Date.now(), session_expiration])
    .then(res => 
    {
        return {sucess:true, content:res.rows[0]};
    })
    .catch(err => 
    { 
        return {sucess:false, content:err}; 
    });
    
    if(!resp.sucess){
        console.log("Cant create cookie because:", resp);
    }

    res.cookie("token", resp.content.id, {/* maxAge:1000*60*60*24,*/path:"/"});
    return resp.content;
}

async function check (token)
{
    const session = await database.query('SELECT * FROM public.session WHERE public.session.id=$1', [token])
    .then(resp => resp.rows[0])
    .catch(err => 
    { 
        return undefined; 
    });

    if(!session) return undefined;
    //console.log(session, new Date());

    if(session.expire_time.getTime() <= new Date().getTime())
    {
        await database.query('DELETE FROM public.session WHERE public.session.id=$1', [token])
        return undefined;
    }

    //console.log(session);
    return session; //await users.get(session.id_user)
}

export default {
    register,
    login,
    load,
    check,
    token
}