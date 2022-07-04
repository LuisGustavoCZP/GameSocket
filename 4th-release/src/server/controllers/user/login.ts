import { Request, Response } from "express";
import { SessionCookie } from "../../models";
import { UserService, CookieService } from "../../services";
import { ResponseWriter } from "../../utils"

async function login (req : Request, res: Response)
{
    try 
    {
        const response = await UserService.login(req.body);
        const token = await CookieService.codify({res, session:response.data} as SessionCookie);
        const untoken = await CookieService.decodify(token.data);
        new ResponseWriter().success(res, 201, untoken);
    }
    catch (e)
    {
        new ResponseWriter().error(res, e as Error);
    }
}

export default login;