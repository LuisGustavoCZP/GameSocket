import { encrypt, decrypt, uuid } from '../modules/crypto.js';
import fs from 'fs';

function database () 
{
    function forEachFile (path, callback)
    {
        if(!fs.existsSync(path))
        {
            fs.mkdirSync(path);
        }

        const files = fs.readdirSync(path);
        //console.log(files);
        if(!files) return;
        files.forEach(file => 
        {
            const fpath = `${path}/${file}`;
            //console.log(fpath);
            callback(fpath);
        });
    }

    function createUsers () 
    {
        const list = {};
        const path = `./database/user`;

        return {
            get(id)
            {
                return list[id];
            },
            search(username)
            {
                for(const id in list)
                {
                    const user = list[id];
                    if(user.username === username) return user;
                }
                return undefined;
            },
            create (username, userpass) 
            {
                if(!username) return -3;
                if(!userpass) return -2;
                if(this.search(username) != undefined) return -1;

                userpass = encrypt(userpass);
                const user = {id:uuid(), username, userpass};
                list[user.id] = user;
                this.save(user.id);
                return user.id;
            },
            delete (id) 
            {
                const user = list[id];
                fs.rmSync(`${path}/${user.username}.json`);
                delete list[id];
            },
            check (username, userpass)
            {
                const user = this.search(username);
                if(!user) return -1;
                if(decrypt(user.userpass) !== userpass) return -2;
                return user.id;
            },
            async save (id)
            {
                const user = list[id];
                fs.writeFileSync(`${path}/${user.username}.json`, JSON.stringify(user, null, 4));
            },
            load ()
            {
                forEachFile (path, (file) => 
                {
                    const text = fs.readFileSync(file);
                    const user = JSON.parse(text);
                    list[user.id] = user;
                });
            }
        }
    }

    const users = createUsers ();
    users.load();

    return {
        users
    };
}

export default database();