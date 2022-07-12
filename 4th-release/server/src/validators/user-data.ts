import { IUser } from "../models";
import NameValidator from "./name";
import PassValidator from "./password";

class UserDataValidator 
{
    public data: Partial<IUser>;
    public errors: string;

    public constructor (user: IUser)
    {
        this.errors = "";
        this.data = this.validate(user);
    }

    public validate (user: IUser) : Partial<IUser>
    {
        const validName = new NameValidator(user.username);
        const validPass = new PassValidator(user.password);

        this.errors = this.errors.concat(`${validName.errors}${validPass.errors}`)
    
        const userData: Partial<IUser> = {
            username:validName.data,
            password:validPass.data,
        }

        return userData;
    }
}

export default UserDataValidator;