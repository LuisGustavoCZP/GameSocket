/* eslint-disable react/jsx-key */
/* eslint-disable react/react-in-jsx-scope */
import { useEffect, useState } from 'react';
import { Request } from '../../services';
import Loading from '../Loading';
import GameRoom from './GameRoom';
import { GameRoomProps, IGameMode } from '../../models';

function GameHome (props: GameRoomProps): JSX.Element
{
	const [getGameModes, setGameModes] = useState<IGameMode[]>([]);
	const [getMode, setMode] = useState(0);

	async function getModes () 
	{
		/* const responseMatch = await Request.get('/match/search');
		const m = responseMatch.data;
		if(m)
		{
			console.log(m);
			setMode(3);
			return;
		} */
		
		const responseModes = await Request.get('/match/modes');
		const p = responseModes.data;
		setGameModes(p);
		console.log(p);
	}

	async function handlerSearcMatch (e: React.MouseEvent<HTMLButtonElement>, type: number) 
	{
		const modeObj = getGameModes[getMode-1];
		props.mode = `${modeObj.name}-${modeObj.types[type]}`;
		/* const responseMatch = await Request.post('/match/insert', {type:`${modeObj.name}-${modeObj.types[type]}`}); */
		//window.location.reload();
		//console.log(props.mode);
		setMode(3);
	}

	async function handlerMatchMode (e: React.MouseEvent<HTMLButtonElement>, modeIndex : number) 
	{
		setMode(modeIndex);
	}

	async function handlerLogout (e: React.MouseEvent<HTMLButtonElement>) 
	{
		await Request.post('/user/logout', {});
		window.location.reload();
	}

	useEffect(()=>
	{
		getModes ();
	}, []);

	if(getMode == 3)
	{
		return (<GameRoom user={props.user} mode={props.mode} />);
	}
	if(getGameModes.length > 0) 
	{
		let options : JSX.Element[];

		if(getMode == 0) options = getGameModes.map((mode, i) => 
			<button className='btn' onClick={(e) => handlerMatchMode(e, i+1)}>
				<span>Partida </span>
				<span className='capitalize'>{mode.name}</span>
			</button>);
		else options = (getGameModes[getMode-1].types).map((type, i) => 
			<button className='btn' onClick={(e) => handlerSearcMatch(e, i)}>
				<span>Modo </span>
				<span className='capitalize'>{type}</span>
			</button>);

		return (
			<section className='flex flex-col w-full h-full justify-center items-center'>
				<div className='secwin modal w-72'>
					<h2>Bora jogar, <span className='text-blue-500'>{`${props.user.username}`}</span>?</h2>
					<div className='modal-content'>
						{ options }
						{ getMode==0? <button className='btn' onClick={handlerLogout}>Logout</button>:<button className='btn' onClick={()=>{setMode(0);}}>Voltar</button>}
					</div>
				</div>
			</section>
		);
	}
	return (<Loading />);
}

export default GameHome;