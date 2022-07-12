/* eslint-disable react/react-in-jsx-scope */
import { useState } from 'react';
import { Login } from './';
import { Register } from './';

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

	if(option === 1) return <Login></Login>;
	if(option === 2) return <Register></Register>;
	else 
	{
		return ( 
			<section className='secwin modal w-72'>
				<h2>Bem vindo</h2>
				<div className='modal-content'>
					<button className='btn' onClick={SelectLogin}>Login</button>
					<button className='btn' onClick={SelectRegister}>Register</button>
				</div>
			</section>
		);
	}
}

export default UserRoom;