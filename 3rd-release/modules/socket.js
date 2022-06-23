import { Server } from 'socket.io';
import auth from './auth.js';
import player from './game/player.js';
import { getState } from './game/state.js';
import action from './game/action.js';
import game from './game.js';

function connections (server) 
{
    const sockets = new Server(server);

    sockets.on('connection', (socket) =>
    {
        const playerId = socket.id;
        socket.on('auth', async (token)=> 
        {
            const session = await auth.check(token);
            if(!session)
            {
                socket.disconnect(true);
                return;
            }
    
            console.log(`> Player connected on Server with id: ${session.id_user}`);
            
            action.registerAction('update', playerId, (ev)=>
            {
                socket.emit('game-update', ev);
            });
    
            await player.add(playerId, session);
            
            socket.on('disconnect', async (socket)=>
            {
                await player.remove(playerId);
                console.log(`> Player disconnected on Server with id: ${session.id_user}`);
            });
    
            socket.emit('setup', await getState(playerId));
    
            socket.on('player-move', async (input)=>
            {
                await game.movePlayer(playerId, input);
            });
        });
    });
    
    server.on('close', (socket) =>
    {
        console.log(`Closing server`);
    });
}

export default connections;