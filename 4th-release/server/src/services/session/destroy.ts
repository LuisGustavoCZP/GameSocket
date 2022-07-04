import { ExceptionTreatment } from "../../utils";
import { sessionConfig } from "../../config";
import Database from "../../database";
import { APIResponse, Session } from "../../models";

async function destroy (sessionId : string) : Promise<APIResponse>
{
    try 
    {
        await Database.remove("sessions", sessionId);

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
            "an error occurred while destroying session"
        );
    }
}

export default destroy;