import { Request, Response } from "express";
import { UserService, CookieService } from "../../services";
import { ResponseWriter } from "../../utils"

async function login (req : Request, res: Response)
{
    try 
    {
        const response = await UserService.login(req.body);
        const responseToken = await CookieService.codify(response.data);
        res.cookie("token", responseToken.data, { path:"/" });
        const untoken = await CookieService.decodify(responseToken.data);
        new ResponseWriter().success(res, 202, untoken);
    }
    catch (e)
    {
        new ResponseWriter().error(res, e as Error);
    }
}

export default login;