/* eslint-disable react/react-in-jsx-scope */
import { useEffect, useState } from 'react';
import { Room } from './User';
import { Request } from '../services';
import Loading from './Loading';
import { GameHome } from './Game';

let user : any;

function Main ()
{
	const [isLogged, setLogged] = useState(0);
    
	async function checkUser ()
	{
		const resp = await Request.get('/user');
        
		if(resp.messages.length > 0) 
		{
			console.log(resp.messages);
			setLogged(1);
		}
		else 
		{
			console.log(resp);
			user = resp.data;
			setLogged(2);
		}
	}

	useEffect(()=>
	{
		checkUser ();
	}, []);

	if(isLogged == 1) return <main className='items-center justify-center'><Room></Room></main>;
	else if(isLogged == 2) return <main><GameHome user={user}></GameHome></main>;
	else return <main className='items-center justify-center'><Loading /></main>;
}

export { Main };