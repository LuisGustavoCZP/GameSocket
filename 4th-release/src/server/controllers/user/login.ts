import { Request, Response } from "express";
import { UserService } from "../../services";
import { ResponseWriter } from "../../utils"

async function login (req : Request, res: Response)
{
    try 
    {
        const response = await UserService.login(req.body);
        new ResponseWriter().success(res, 201, response);
    }
    catch (e)
    {
        new ResponseWriter().error(res, e as Error);
    }
}

export default login;