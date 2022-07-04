import bcrypt from "bcrypt";
import { security } from "../config";

async function encrypt (info: string) : Promise<string>
{
    const salt = await bcrypt.genSalt(security.saltRounds);
    return await bcrypt.hash(info, salt);
}

async function check (info: string, hash: string) : Promise<boolean>
{
    return await bcrypt.compare(info, hash);
}

export default { encrypt, check }