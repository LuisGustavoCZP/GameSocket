import jwt from "jsonwebtoken";
import { security } from "../../config";
import { ExceptionTreatment } from "../../utils";
import { APIResponse, Session } from "../../models";

async function decodify (token : string) : Promise<APIResponse<Partial<Session>>>
{
    try 
    {
        const decoded = jwt.verify(token, security.secret);
        if(decoded)
        {
            return {
                data: decoded,
                messages: []
            } as APIResponse<Partial<Session>>;
            
        }
        throw Error("403: Token can't be verified");
    }
    catch (e)
    {
        throw new ExceptionTreatment(
            e as Error,
            500,
            "an error occurred while decodifying token"
        );
    }
}

export default decodify;