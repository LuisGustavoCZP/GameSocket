import { ExceptionTreatment } from "../../utils";
import { APIResponse, Session } from "../../models";
import cookieService from "../cookies";

async function auth (cookies : any) : Promise<APIResponse<Partial<Session>>>
{
    try 
    {
        const token = cookies["token"];
        if(!token)
        {  
            throw Error("301: Session doesn't exist");
        }
        //console.log(token);
        const session = await cookieService.decodify(token);
        if(session)
        {
            return {
                data:session.data,
                messages:[]
            } as APIResponse<Partial<Session>>
        }

        throw Error("404: Session can't be recovery");
    }
    catch (e)
    {
        throw new ExceptionTreatment(
            e as Error,
            500,
            "an error occurred while trying to authenticate"
        );
    }
}

export default auth;