import { Request, Response } from "express";
import { UserService, MatchService } from "../../services";
import { ResponseWriter } from "../../utils"

async function search (req : Request, res: Response)
{
    try 
    {
        const responseToken = await UserService.auth(req.cookies["token"]);

        //console.log(req.body.type);
        const responseMatch = await MatchService.search(responseToken.data.userId);

        new ResponseWriter().success(res, 200, responseMatch);
    }
    catch (e)
    {
        new ResponseWriter().error(res, e as Error);
    }
}

export default search;