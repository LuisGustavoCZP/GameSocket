import { ExceptionTreatment, bcrypt } from "../../utils";
import Database from "../../database";
import { IUser, APIResponse } from "../../models";
import { UserDataValidator } from "../../validators";

async function register (user : IUser) : Promise<APIResponse<IUser>>
{
    try 
    {
        const validUserData = new UserDataValidator(user);

        if(validUserData.errors)
        {
            throw Error(`400: ${validUserData.errors}`);
        }

        const validUser = validUserData.data;

        const respUser = await Database.select("users", { username:validUser.username });
        if(respUser.length > 0) 
        {
            throw Error("409: User already exists");
        }
        console.log(respUser);

        validUser.password = await bcrypt.encrypt(validUser.password as string);

        const respNewUser = await Database.insert("users", validUser);
        
        return {
            data: respNewUser,
            messages: []
        } as APIResponse<IUser>;
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

export default register;