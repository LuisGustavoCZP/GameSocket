import { ExceptionTreatment } from "../../utils";
import { sessionConfig } from "../../config";
import Database from "../../database";
import { APIResponse, Session } from "../../models";
import destroy from "./destroy";

async function get (userId : string) : Promise<APIResponse<Session>>
{
    try 
    {
        const respSession = await Database.select("sessions", { user:userId }) as Session[];
        if(respSession.length > 0) 
        {
            const session = respSession[0];

            const creation = new Date(session.createdAt);
            const expiration = creation.getTime() + sessionConfig.expiration;
            const leftTime = Date.now() - expiration;
            //console.log(leftTime);
            if(leftTime > 0)
            {
                await destroy(session.id);
            }
            else
            {
                return {
                    data: session,
                    messages: []
                } as APIResponse<Session>;
            }
        }

        return {
            data: null,
            messages: []
        } as APIResponse;
    }
    catch (e)
    {
        throw new ExceptionTreatment(
            e as Error,
            500,
            "an error occurred while getting session"
        );
    }
}

export default get;