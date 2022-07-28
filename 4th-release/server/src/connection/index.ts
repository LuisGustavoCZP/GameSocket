import { Server, Socket } from 'socket.io';
import database from '../database';
import { IMatchPlayer, IMatchUser, Session } from '../models';
import Listener from "../server";
import { MatchService, UserService } from '../services/';
import { MatchSetup, matchSetups } from '../services/match/data';
import { GameMatch, gameData } from '../services/game/';

class Connections 
{
    public listeners;
    public http : any;
    public https : any;

    constructor (listener : Listener)
    {
        this.listeners = {
            http:listener.httpServer, 
            https:listener.httpsServer
        };
        this.http = new Server(listener.httpServer);
        this.https = new Server(listener.httpsServer);

        this.onconnect ();
    }

    public on (event:string, action : void | any)
    {
        this.http.on(event, action);
        this.https.on(event, action);
    }

    public onconnect ()
    {
        this.on('connection', async (socket: Socket) =>
        {
            const playerId = socket.id;
            console.log("Novo ID", playerId);
            const session = await database.get("sessions", socket.handshake.auth["token"]) as Session;
            if(!session)
            {
                console.log("Connection Disconected", playerId);
                socket.disconnect(true);
                return;
            }

            const responseMatch = await MatchService.search(session.user);
            
            socket.emit('check-playing', responseMatch.data?.id);

            socket.on('match-search', async (type: string) => 
            {
                //console.log("Match Search");
                const responseMatchSetup = await MatchService.create(session.user, type);
                if(responseMatchSetup.messages.length > 0)
                {
                    console.log("Search Disconected", session.user);
                    socket.disconnect(true);
                    return;
                }

                const matchSetup = responseMatchSetup.data;
                console.log(`> Player connected on Server with id: ${session.user} and match: ${matchSetup.id}`);

                const user = await UserService.get(session.user);

                const matchPlayer = {
                    index: -1,
                    owner: user.data.username,
                    socket: {id:socket.id, commander:(key: string, data: any) => {socket.emit(key, data)}},
                    setup: null
                };
                matchSetup.subscribe(matchPlayer);

                socket.on('disconnect', async ()=>
                {
                    //console.log("User", session.user);
                    /* const responseMatch = await MatchService.search(session.user);
                    if(!responseMatch.data)
                    {
                        return;
                    }

                    const matchSetup = responseMatch.data as MatchSetup;
                    const matchPlayer = await matchSetup.getPlayer(playerId); */
                    
                    let n = await matchSetup.unsubscribe(matchPlayer);

                    //console.log("Deletados", matchSetups);
                    console.log(`> Player disconnected on Server with id: ${session.user} at index:${n}`);
                });
            });
            
            socket.on('match-confirm', async ()=>
            {
                //console.log("User", session.user);
                const responseMatch = await MatchService.search(session.user);
                if(!responseMatch.data)
                {
                    console.log("Disconected", session.user);
                    socket.disconnect(true);
                    return;
                }

                const matchSetup = responseMatch.data;
                //console.log("Match", matchSetup);
                
                await matchSetup.confirm(playerId);
            });

            socket.on('match-unconfirm', async ()=>
            {
                //console.log("User", session.user);
                const responseMatch = await MatchService.search(session.user);
                if(!responseMatch.data)
                {
                    console.log("Disconected", session.user);
                    socket.disconnect(true);
                    return;
                }

                const matchSetup = responseMatch.data;
                //console.log("Match", matchSetup);
                
                await matchSetup.unconfirm(playerId);
            });
            
            socket.on('player-started', async ()=>
            {
                console.log(`Preparado: ${playerId}`);

                const gameMatch = await gameData.byUser(session.user) as GameMatch;
                const playerIndex = gameMatch.players.findIndex((player : any) => player.ID == playerId);
                
                socket.emit('game-ready' as any);

                socket.on('player-move', async (point)=>
                {
                    //const player = gameMatch.players[playerIndex];
                    const x = Math.floor(point.x*gameMatch.map.width);
                    const y = Math.floor(point.y*gameMatch.map.height);
                    await gameMatch.orderGoTo(playerIndex, {x, y})
                    //gameMatch.update();
                });
            });
            
            //MatchService.data.usersSocket.set(playerId, session.user);
            
            //let n = matchSetup.players.findIndex((v, i) => {if(v.owner == session.user) return i});
            //matchSetup.players[n].socket = playerId;

            
            /* action.registerAction('update', playerId, (ev : void | any)=>
            {
                socket.emit('game-update', ev);
            });
    
            await player.add(playerId, session);
            
            
    
            socket.emit('setup', await getState(playerId));
    
            socket.on('player-move', async (input : string)=>
            {
                await game.movePlayer(playerId, input);
            }); */

            
        });
    }

    public onclose (action : any | unknown)
    {
        this.listeners.http.on('close', () =>
        {
            console.log(`Closing server`);
        });
        this.listeners.https.on('close', () =>
        {
            console.log(`Closing server`);
        });
    }
}

export default Connections;