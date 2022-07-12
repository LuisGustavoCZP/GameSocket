import { IMatchUser } from "./";

interface IUser extends IMatchUser {
    id: string
    username: string
    password: string
    createdAt: string,
}

export default IUser;