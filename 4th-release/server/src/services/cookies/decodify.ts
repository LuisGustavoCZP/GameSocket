import jwt from "jsonwebtoken";
import { security } from "../../config";
import { ExceptionTreatment } from "../../utils";
import { APIResponse, Session, SessionCookie } from "../../models";

async function decodify (token : string) : Promise<APIResponse<SessionCookie>>
{
    try 
    {
        const decoded = jwt.verify(token, security.secret) as any;
        if(decoded)
        {
            delete decoded["iat"];
            return {
                data: decoded,
                messages: []
            } as APIResponse<SessionCookie>;
            
        }
        throw Error("403: Token can't be verified");
    }
    catch (e)
    {
        //console.log(e);
        throw new ExceptionTreatment(
            e as Error,
            500,
            "an error occurred while decodifying token"
        );
    }
}

export default decodify;