import { ExceptionTreatment } from "../../utils";
import Database from "../../database";
import { APIResponse, Session } from "../../models";
import getSession from "./get";

async function create (userId : string) : Promise<APIResponse<Session>>
{
    try 
    {
        const respSession = await getSession(userId);
        if(respSession.data)
        {
            return respSession;
        }

        const session = await Database.insert("sessions", 
        {
            user:userId,
            //createdAt: new Date().toISOString(),
        }) as Session;

        return {
            data: session,
            messages: []
        } as APIResponse<Session>;
        
    }
    catch (e)
    {
        throw new ExceptionTreatment(
            e as Error,
            500,
            "an error occurred while inserting user on database"
        );
    }
}

export default create;