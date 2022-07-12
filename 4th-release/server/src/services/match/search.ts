import { ExceptionTreatment } from "../../utils";
import matchData, { MatchSetup } from "./data";
import { APIResponse, IMatchSetup } from "../../models";

async function search (userId : string) : Promise<APIResponse<MatchSetup>>
{
    try 
    {
        if(!userId || userId == '')
        {
            throw Error("301: UserID doesn't exist");
        }

        let match = await matchData.byUser(userId);
        if(match)
        {
            return {
                data:match,
                messages:[]
            } as APIResponse<MatchSetup>;
        }

        return {
            data:null as unknown,
            messages:[]
        } as APIResponse<MatchSetup>;
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

export default search;