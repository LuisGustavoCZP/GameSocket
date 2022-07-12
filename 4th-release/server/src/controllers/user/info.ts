import { Request, Response } from "express";
import { UserService } from "../../services";
import { ResponseWriter } from "../../utils"

async function info (req : Request, res: Response)
{
    try 
    {
        const responseToken = await UserService.auth(req.cookies["token"]);
        const responseUser = await UserService.get(responseToken.data.userId) as any;
        responseUser.data.sessionId = responseToken.data.sessionId;
        new ResponseWriter().success(res, 200, responseUser);
    }
    catch (e)
    {
        res.cookie("token", "undefined", { maxAge:1, path:"/" });
        new ResponseWriter().error(res, e as Error);
    }
}

export default info;