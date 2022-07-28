/* eslint-disable react/react-in-jsx-scope */
import { useEffect, useState } from 'react';
import { GameRoomProps, IMatchSetup, ServerToClientEvents, ClientToServerEvents } from '../../models';
import Searching from '../Searching';
import * as SocketIO from 'socket.io-client';
import MatchRoom from './MatchRoom';
import GameScreen from './GameScreen';

let socket : SocketIO.Socket<ServerToClientEvents, ClientToServerEvents> = (null as unknown) as SocketIO.Socket<ServerToClientEvents, ClientToServerEvents>;
function GameRoom (props: GameRoomProps)
{
	const [getMatchSetup, setMatchSetup] = useState((null as unknown) as IMatchSetup);
	const [getMatchStarted, setMatchStarted] = useState(null);

	useEffect(()=>
	{
		socket = SocketIO.io({
			auth: {
				token: props.user.sessionId
			}
		});
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
		socket.on('match-start' as any, (data: any)=>
		{
			console.log('User started match', data);
			setMatchStarted(data);
		});
	}, []);
	
	if(!getMatchSetup) return (<Searching />);
	if(getMatchStarted) return (<GameScreen user={props.user} socket={socket} gameData={getMatchStarted}/>);
	else return (<MatchRoom matchSetup={getMatchSetup} user={props.user} socket={socket}/>);
}

export default GameRoom;
