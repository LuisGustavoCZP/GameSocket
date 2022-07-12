import { ExceptionTreatment, bcrypt } from "../../utils";
import Database from "../../database";
import { IUser, APIResponse, Session } from "../../models";
import session from "../session";
import { UserDataValidator } from "../../validators";

async function login (user : IUser) : Promise<APIResponse<Session>>
{
    try 
    {
        const validUserData = new UserDataValidator(user);

        if(validUserData.errors)
        {
            throw Error(`400: ${validUserData.errors}`);
        }

        const respUser = await Database.select("users", { username:user.username }) as IUser[];
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

        const respSession = await session.create(userData.id);
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
            "an error occurred while trying to login"
        );
    }
}

export default login;