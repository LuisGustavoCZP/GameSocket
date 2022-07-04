import { Request, Response } from "express";
import { UserService, CookieService, SessionService } from "../../services";
import { ResponseWriter } from "../../utils"

async function logout (req : Request, res: Response)
{
    try 
    {
        const responseToken = await UserService.auth(req.cookies);
        if(responseToken.data.id) await SessionService.destroy(responseToken.data.id);
        res.cookie("token", "undefined", { maxAge:1, path:"/" });

        new ResponseWriter().success(res, 200, responseToken);
    }
    catch (e)
    {
        new ResponseWriter().error(res, e as Error);
    }
}

export default logout;