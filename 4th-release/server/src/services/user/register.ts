import { ExceptionTreatment, bcrypt } from "../../utils";
import Database from "../../database";
import { User, APIResponse } from "../../models";

async function register (user : User) : Promise<APIResponse<User>>
{
    try 
    {
        const respUser = await Database.select("users", { username:user.username });
        if(respUser.length > 0) 
        {
            throw Error("409: User already exists");
        }
        console.log(respUser);

        user.password = await bcrypt.encrypt(user.password);

        const respNewUser = await Database.insert("users", user);
        
        return {
            data: respNewUser,
            messages: []
        } as APIResponse<User>;
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