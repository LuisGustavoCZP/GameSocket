/* eslint-disable react/jsx-key */
/* eslint-disable react/react-in-jsx-scope */
import { useState } from 'react';
import { FormHandler } from '../../libs';

function Login() 
{
	const [messages, setMessages] = useState([] as string[]);
	const {submit, goBack} = FormHandler('/user/login', setMessages);
    
	return (
		<section className="secwin modal">
			<h2>Login</h2>
			<form className="modal-content" method="POST" action="/user/login">
				<span className="modal-content-span">
					<label htmlFor="username">Usuario</label>
					<input type="text" id="username" />
				</span>
				<span className="modal-content-span">
					<label htmlFor="password">Senha</label>
					<input type="password" id="password" />
				</span>
				<button className='btn' onClick={submit}>Entrar</button>
			</form>
			<ul className='flex-col w-full text-red-400 p-2 bg-slate-100 h-10 overflow-y-scroll'>
				{ messages.map((message) => <li className='my-1'>{ message }</li>) }
			</ul>
			<div className='w-full px-2 pb-2'>
				<button className='btn w-full' onClick={goBack}>Voltar</button>
			</div>
		</section>
	);
}

export default Login;