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

function MatchRoom (props : IMatchRoomProps)
{
	const socket = props.socket;
	const matchSetup = props.matchSetup;
	const playerSlots : JSX.Element[] = [];

	function handlePreparation ()
	{
		//console.log(socket);
		
		socket.emit('match-ready' as any);
		
		console.log('Clicou preparar');
	}

	useEffect(()=>
	{
		socket.on('match-update' as any, (data: IMatchSetup)=>
		{
			console.log('User updated setup', {data});
		});
	},[]);

	for(let i = 0; i < matchSetup.configs.max; i++)
	{
		const player = matchSetup.players[i];
		const b = player?.owner == props.user.username;

		const el = (<li className='flex flex-col w-1/2'>
			<h3>{player?.owner || `Player ${i}`}</h3>
			<button className={b?'btn':'btn-d'} onClick={()=>{handlePreparation ();}}>Pronto!</button>
		</li>);
		playerSlots.push(el);
	}
	return (<ul className='flex w-3/4 justify-between content-between'>{playerSlots}</ul>);
}

export default MatchRoom;