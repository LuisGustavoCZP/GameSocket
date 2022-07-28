/* eslint-disable react/react-in-jsx-scope */
import { useEffect, useState } from 'react';
import { IMatchSetup, IUser, ServerToClientEvents, ClientToServerEvents } from '../../models';
import * as SocketIO from 'socket.io-client';

interface IMatchRoomProps 
{
	user: IUser
	matchSetup: IMatchSetup
	socket: SocketIO.Socket<ServerToClientEvents, ClientToServerEvents>
}

function confirmed(mask : number, index : number) : boolean 
{
	return ((mask & (1 << index)) > 0);
}

function MatchRoom (props : IMatchRoomProps)
{
	const [getAlert, setAlert] = useState('');
	const {socket, matchSetup, user} = props;
	const playerSlots : JSX.Element[] = [];

	function handleMatchConfirmation ()
	{
		socket.emit('match-confirm' as any);
		console.log('Clicou Confirmar');
	}

	function handleMatchUnconfirmation ()
	{
		socket.emit('match-unconfirm' as any);
		console.log('Clicou Desconfirmar');
	}

	useEffect(()=>
	{
		console.log('Abriu preparação');
		socket.on('match-update' as any, (data: IMatchSetup)=>
		{
			setAlert('');
		});
		socket.on('match-starting' as any, (data: IMatchSetup)=>
		{
			console.log('User waiting ', {data});
			
			setAlert(`Iniciando em ${data}`);
		});
	},[]);
	
	for(let i = 0; i < matchSetup.configs.max; i++)
	{
		const player = matchSetup.players[i];
		const empty = !player;
		const isUser = !empty && player.owner == user.username;
		const isConfirmed = !empty && confirmed(matchSetup.confirmations, player.index);

		let btn = 'btn';
		if(isConfirmed) btn += ' active';
		if(!isUser) btn += ' disabled';

		const el = (<li className='flex flex-col w-5/12 bg-slate-100 m-2 rounded-lg'>
			<span className='flex items-center justify-between px-3 py-1'>
				<i className={empty?'fa-regular fa-user':'fa-solid fa-user'}></i>
				<h3>{player?.owner || `Player ${i}`}</h3>
			</span>
			<button className={btn} onClick={()=>
			{
				if(!isConfirmed) handleMatchConfirmation(); 
				else handleMatchUnconfirmation();
			}}>{empty?'Vazio':isConfirmed?isUser?'Cancelar':'Pronto':isUser?'Iniciar':'Espera'}</button>
		</li>);
		playerSlots.push(el);
	}

	return <section className='flex flex-col w-full h-full justify-center items-center relative'><div className={`absolute flex flex-col w-full h-full pointer-events-none justify-center items-center${!getAlert?' hidden':''}`}><h2>{getAlert}</h2></div><ul className='flex flex-wrap w-3/4 h-3/4 justify-between content-between'>{playerSlots}</ul></section>;
}

export default MatchRoom;