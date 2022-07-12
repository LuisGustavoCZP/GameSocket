import { ExceptionTreatment } from "../../utils";
import Database from "../../database";
import { IUser, APIResponse, IMatchUser } from "../../models";

async function get (userId : string) : Promise<APIResponse<IMatchUser>>
{
    try 
    {
        if(!userId || userId == '')
        {
            throw Error("301: UserID doesn't exist");
        }

        const userData = await Database.get("users", userId) as IUser;
        if(!userData) 
        {
            throw Error("404: User not found");
        }

        const user = {
            id:userData.id,
            username:userData.username,
        } as IMatchUser;

        return {
            data:user,
            messages:[]
        } as APIResponse<IMatchUser>;
    }
    catch (e)
    {
        throw new ExceptionTreatment(
            e as Error,
            500,
            "an error occurred while trying to login"
        );
    }
}

export default get;