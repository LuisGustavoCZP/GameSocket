import { ExceptionTreatment } from "../../utils";
import search from "./search";
import matchData, { MatchSetup }  from "./data";
import { APIResponse, IMatchPlayer, IMatchSetup } from "../../models";

async function create (userId : string, type: string) : Promise<APIResponse<MatchSetup>>
{
    try 
    {
        if(!userId || userId == '')
        {
            throw Error("301: UserID is empty");
        }

        if(!type || type == '')
        {
            throw Error("301: Type is empty");
        }

        let responseSearch = await search(userId);
        if(responseSearch.data)
        {
            throw Error("409: User already is in a Match");
        }

        const matchs = await matchData.uncompleted(type);
        if(matchs.length > 0)
        {
            const match = matchs[0];
            /* matchPlayer.index = match.players.length;
            match.players.push(matchPlayer); */
            return {
                data:match,
                messages:[]
            } as APIResponse<MatchSetup>;
        }
        
        const match = await matchData.create(type);
        if(!matchData) 
        {
            throw Error("404: Match can not be created");
        }

        /* match.players.push(matchPlayer); */
        return {
            data:match,
            messages:[]
        } as APIResponse<MatchSetup>;
    }
    catch (e)
    {
        console.log("Error:", e);
        throw new ExceptionTreatment(
            e as Error,
            500,
            "an error occurred while trying to matching"
        );
    }
}

export default create;