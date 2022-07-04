import { ExceptionTreatment, bcrypt } from "../../utils";
import Database from "../../database";
import { User, APIResponse } from "../../models";
import session from "../session";

async function login (user : User) : Promise<APIResponse>
{
    try 
    {
        const respUser = await Database.select("users", { username:user.username }) as User[];
        if(respUser.length == 0) 
        {
            throw Error("404: User not found");
        }

        const userData = respUser[0];
        const samePass = await bcrypt.check(user.password, userData.password);
        if(!samePass)
        {
            throw Error("400: User password doesn't match");
        }

        const respSession = await session.create(userData.id)
        if(respSession.data)
        {
            return respSession;
        }
        
        throw Error("400: Session can't be created");
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

export default login;