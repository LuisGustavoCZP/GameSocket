"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
class Connections {
    constructor(listener) {
        this.listeners = {
            http: listener.httpServer,
            https: listener.httpsServer
        };
        this.http = new socket_io_1.Server(listener.httpServer);
        this.https = new socket_io_1.Server(listener.httpsServer);
    }
    on(event, action) {
        this.http.on(event, action);
        this.https.on(event, action);
    }
    /* public onconnect ()
    {
        this.on('connection', (socket: any) =>
        {
            const playerId = socket.id;
            socket.on('auth', async (token : string)=>
            {
                const session = await auth.check(token);
                if(!session)
                {
                    socket.disconnect(true);
                    return;
                }
        
                console.log(`> Player connected on Server with id: ${session.id_user}`);
                
                action.registerAction('update', playerId, (ev : void | any)=>
                {
                    socket.emit('game-update', ev);
                });
        
                await player.add(playerId, session);
                
                socket.on('disconnect', async ()=>
                {
                    await player.remove(playerId);
                    console.log(`> Player disconnected on Server with id: ${session.id_user}`);
                });
        
                socket.emit('setup', await getState(playerId));
        
                socket.on('player-move', async (input : string)=>
                {
                    await game.movePlayer(playerId, input);
                });
            });
        });
    } */
    onclose(action) {
        this.listeners.http.on('close', () => {
            console.log(`Closing server`);
        });
        this.listeners.https.on('close', () => {
            console.log(`Closing server`);
        });
    }
}
exports.default = Connections;
