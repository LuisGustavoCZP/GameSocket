import {IGameSetup, IMatchUser} from './';

interface IMatchPlayer
{
    index: number
    owner: string
    socket: string
    setup: IGameSetup | null
}

export default IMatchPlayer;