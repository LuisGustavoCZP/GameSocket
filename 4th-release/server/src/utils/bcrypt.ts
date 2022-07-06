import bcrypt from "bcrypt";

class BCrypt 
{
    saltRounds = 10;

    async encrypt (info: string) : Promise<string>
    {
        const salt = await bcrypt.genSalt(this.saltRounds);
        return await bcrypt.hash(info, salt);
    }
    
    async check (info: string, hash: string) : Promise<boolean>
    {
        return await bcrypt.compare(info, hash);
    }
}

export default new BCrypt ();