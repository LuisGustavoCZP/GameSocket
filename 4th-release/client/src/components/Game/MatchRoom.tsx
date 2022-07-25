/* eslint-disable react/react-in-jsx-scope */
import React, { useEffect, useState, Component } from 'react';
import { IMatchSetup, IUser, ServerToClientEvents, ClientToServerEvents } from '../../models';
import * as SocketIO from 'socket.io-client';
import { VideoStreamer } from '../../libs/videoStreamer';

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
	const [videoStreamer, setVideoStreamer] = useState<VideoStreamer>((null as unknown) as VideoStreamer);
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

	function getPlayerIndex (id : string) : number
	{
		return matchSetup.players.findIndex((player) => 
		{
			if(player && id == player.socket)
			{
				return true;
			}
		});
	}

	useEffect(()=>
	{	
		const streamer = new VideoStreamer(socket, .1);
		
		console.log('Abriu preparação');
		socket.on('match-update' as any, (data: IMatchSetup)=>
		{
			setAlert('');
		});
		socket.on('match-starting' as any, (data: IMatchSetup)=>
		{
			console.log('User started from', {data});
			
			setAlert(`Iniciando em ${data}`);
		});
		socket.on('video-receive' as any, (data : any)=> 
		{
			//console.log('Recebendo dado', data);
			const playerIndex = getPlayerIndex(data.id);
			streamer.render(playerIndex, data.imageSrc);
		});

		streamer.start();
		setVideoStreamer(streamer);
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
				{videoStreamer?.createViews(isUser)}
				<i className={empty?'fa-regular fa-user':'fa-solid fa-user'}></i>
				<h3>{player?.owner || `Player ${i}`}</h3>
			</span>
			<button className={btn} onClick={()=>
			{
				if(!isConfirmed) handleMatchConfirmation(); 
				else handleMatchUnconfirmation();
			}}>{empty?'Vazio':isConfirmed?'Pronto!':'Espera'}</button>
		</li>);
		playerSlots.push(el);
	}
	
	return <section className='flex flex-col w-full h-full relative justify-center items-center'><div className={`absolute flex flex-col w-full h-full pointer-events-none justify-center items-center${!getAlert?' hidden':''}`}><h2>{getAlert}</h2></div><ul className='flex flex-wrap w-3/4 h-3/4 justify-between content-between'>{playerSlots}</ul></section>;
}

export default MatchRoom;