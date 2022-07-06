import { useState } from 'react';
import { Login } from './Login';
import { Register } from "./Register";

function UserRoom ()
{
    const [option, setOption] = useState(0);

    function SelectLogin (event: React.MouseEvent<HTMLButtonElement>)
    {
        setOption(1);
    }

    function SelectRegister (event: React.MouseEvent<HTMLButtonElement>)
    {
        setOption(2);
    }

    if(option === 1) return <main><Login></Login></main>;
    if(option === 2) return <main><Register></Register></main>;
    else {
        return <main>
            <section>
                <button onClick={SelectLogin}>Login</button>
                <button onClick={SelectRegister}>Register</button>
            </section>
        </main>
    }
}

export { UserRoom };