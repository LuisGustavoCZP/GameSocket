import jwt from "jsonwebtoken";
import { security } from "../../config";
import { ExceptionTreatment } from "../../utils";
import { APIResponse, SessionCookie } from "../../models";

async function codify (sessionCookie : SessionCookie) : Promise<APIResponse<string>>
{
    try 
    {
        const { id:sessionId, user:userId } = sessionCookie.session;
        const tokenData = { sessionId, userId };
        //console.log("tokenData", tokenData);
        const token = jwt.sign(tokenData, security.secret);
        sessionCookie.res.cookie("token", token, { path:"/" })

        return {
            data: token,
            messages: []
        } as APIResponse<string>;
        
    }
    catch (e)
    {
        throw new ExceptionTreatment(
            e as Error,
            500,
            "an error occurred while cofifying token"
        );
    }
}

export default codify;