import { useEffect, useState } from 'react';
import { UserRoom } from './UserRoom';
import { Request } from '../services';

function Main ()
{
    const [isLogged, setLogged] = useState(null);
    async function checkLogin ()
    {
        const resp = await Request.get("/user");
        
        if(resp.messages.length > 0) 
        {
            console.log(resp.messages);
            setLogged(null);
        } else {
            setLogged(resp.data);
        }
    }

    useEffect(()=>
    {
        checkLogin ();
    }, []);

    if(!isLogged) return <main><UserRoom></UserRoom></main>;
    else return <main>Game</main>;
}

export { Main };