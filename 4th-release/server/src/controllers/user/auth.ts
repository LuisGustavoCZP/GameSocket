import { Request, Response } from "express";
import { UserService } from "../../services";
import { ResponseWriter } from "../../utils"

async function auth (req : Request, res: Response)
{
    try 
    {
        const response = await UserService.auth(req.cookies);
        new ResponseWriter().success(res, 200, response);
    }
    catch (e)
    {
        new ResponseWriter().error(res, e as Error);
    }
}

export default auth;