import { Socket } from "socket.io";
import { IGameSetup, IMatchUser, IMatchSocket } from "./";

interface IMatchPlayer
{
    index: number
    owner: string
    socket: IMatchSocket
    setup: IGameSetup | null
}

export default IMatchPlayer;