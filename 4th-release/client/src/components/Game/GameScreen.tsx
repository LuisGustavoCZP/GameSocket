/* eslint-disable react/react-in-jsx-scope */
import React, { useEffect, useState } from 'react';
import { IMatchSetup, IUser, ServerToClientEvents, ClientToServerEvents } from '../../models';
import * as SocketIO from 'socket.io-client';

interface IGameProps 
{
	user: IUser
	socket: SocketIO.Socket<ServerToClientEvents, ClientToServerEvents>
	gameData: any
}

function GameScreen (props : IGameProps)
{
	const {socket, user, gameData} = props;
	const mapRef = React.createRef<HTMLCanvasElement>();
	//const gameRef = React.createRef<HTMLCanvasElement>();

	useEffect(()=>
	{
		const mapCanvas = mapRef.current as HTMLCanvasElement;
		const mapContext = mapCanvas.getContext('2d') as CanvasRenderingContext2D;

		function tileRender (x : number, y : number, type : any)
		{
			mapContext.fillStyle = type.color;
			mapContext.fillRect(x*46, y*46, 46, 46);
		}

		function gameCicle ()
		{
			const map = gameData.map;
			let n = 0;
			for (let y = 0; y < map.height; y++)
			{
				for (let x = 0; x < map.width; x++)
				{
					const tile = map.data[n++];
					if(!tile) continue;
					const type = map.types[tile.type];
					tileRender(x, y, type);
				}
			}

			gameData.players.forEach((player : any) => 
			{
				mapContext.fillStyle = player.owner == user.username?'green':'red';
				mapContext.fillRect(player.x*46, player.y*46, 46, 46);
			});

			requestAnimationFrame(gameCicle);
		}

		socket.on('game-update' as any, (data: any)=>
		{
			console.log('update', data);
			
		});

		mapCanvas.addEventListener('click', (e) => 
		{
			const point = {x:e.offsetX/mapCanvas.clientWidth, y:e.offsetY/mapCanvas.clientHeight};
			socket.emit('player-move' as any, point);
			console.log('Clicou', point);
		});
		requestAnimationFrame(gameCicle);
	}, []);


	return (
		<div className='flex relative justify-center items-center h-full w-full'>
			<canvas id="map" ref={mapRef} className='absolute h-full' width={512} height={512}></canvas>
			{/* <canvas id="game" ref={gameRef} className='absolute h-full' width={512} height={512}></canvas> */}
		</div>
	);
}

export default GameScreen;