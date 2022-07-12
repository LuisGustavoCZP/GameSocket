import { ExceptionTreatment } from "../../utils";
import { matchConfig } from "../../config";
import { APIResponse } from "../../models";

async function modes () : Promise<APIResponse>
{
    try 
    {
        let m = matchConfig.modes();
        return {
            data:m,
            messages:[]
        } as APIResponse;
    }
    catch (e)
    {
        throw new ExceptionTreatment(
            e as Error,
            500,
            "an error occurred while trying to matching"
        );
    }
}

export default modes;