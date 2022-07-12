import { Request, Response } from "express";
import { matchConfig } from "../../config";
import { MatchService } from "../../services";
import { ResponseWriter } from "../../utils"


async function modes (req : Request, res: Response)
{
    try 
    {
        const modes = await MatchService.modes();
        //console.log(modes.data)
        new ResponseWriter().success(res, 200, modes);
    }
    catch (e)
    {
        new ResponseWriter().error(res, e as Error);
    }
}

export default modes;