import { Request, Response } from "express";
import { UserService, CookieService, SessionService } from "../../services";
import { ResponseWriter } from "../../utils"

async function logout (req : Request, res: Response)
{
    try 
    {
        const responseToken = await UserService.auth(req.cookies["token"]);
        if(responseToken.data.sessionId) await SessionService.destroy(responseToken.data.sessionId);
        res.cookie("token", "undefined", { maxAge:1, path:"/" });

        new ResponseWriter().success(res, 200, responseToken);
    }
    catch (e)
    {
        new ResponseWriter().error(res, e as Error);
    }
}

export default logout;