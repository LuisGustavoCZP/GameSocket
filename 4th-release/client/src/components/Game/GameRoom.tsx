/* eslint-disable react/react-in-jsx-scope */
import { useEffect, useState } from 'react';
import { GameRoomProps, IMatchSetup, ServerToClientEvents, ClientToServerEvents } from '../../models';
import Searching from '../Searching';
import * as SocketIO from 'socket.io-client';
import MatchRoom from './MatchRoom';

function GameRoom (props: GameRoomProps)
{
	const [getMatchSetup, setMatchSetup] = useState((null as unknown) as IMatchSetup);
	const socket: SocketIO.Socket<ServerToClientEvents, ClientToServerEvents> = SocketIO.io({
		auth: {
			token: props.user.sessionId
		}
	});

	useEffect(()=>
	{
		socket.on('connect', ()=>
		{
			console.log('Player triyng to connect with server');
		});
		socket.on('disconnect', ()=>
		{
			console.log('Player is disconnected from server');
			window.location.reload();
		});
		socket.on('check-playing' as any, (data: string | undefined) =>
		{
			if(data == '' || data == undefined)
			{
				socket.emit('match-search' as any, props.mode);
			}
			else 
			{
				console.log('User is playing');
			}
		});
		socket.on('match-update' as any, (data: IMatchSetup)=>
		{
			console.log('User received setup', {data});
			setMatchSetup(data);
		});
	}, []);
	
	if(!getMatchSetup) return (<Searching />);
	else return (<MatchRoom matchSetup={getMatchSetup} user={props.user} socket={socket}/>);
}

export default GameRoom;
