import express from 'express';
import http from 'http'
import { Server } from 'socket.io';
import createGame from './modules/game.js';

const app = express();
const server = http.createServer(app);
const sockets = new Server(server);
const game = createGame();

app.use(express.static('public'));

sockets.on('connection', (socket) =>
{
    const playerId = socket.id;
    console.log(`> Player connected on Server with id: ${playerId}`);

    socket.on('auth', (auth)=> 
    {
        if(!auth)
        {
            socket.disconnect(true);
            return;
        }

        game.addPlayer(playerId);
        socket.on('disconnect', (socket)=>
        {
            game.removePlayer(playerId);
            console.log(`> Player disconnected on Server with id: ${playerId}`);
        });
    
        socket.emit('setup', game.getState(playerId));
    });

    
    
    /*
    socket.on('move-player', (command)=>
    {
        command.playerId = playerId;
        command.type = 'move-player';

        game.movePlayer(command);
    }); */
    
});

server.listen(3000, () =>
{
    console.log(`> Server listening on http://localhost:3000`);
});