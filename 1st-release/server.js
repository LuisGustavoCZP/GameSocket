import express from "express";
import http from "http";
import createGame from './public/game.js';
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app);
const sockets = new Server(server);

app.use(express.static('public'));

const game = createGame();
game.start();

game.subscribe((command) => {
    console.log(`Emitting ${command.type}`);
    sockets.emit(command.type, command);
});
//game.addPlayer({id:'p1', x:1, y:1});
//game.addFruit({id:'f1', x:1, y:3, points:50});
console.log(game.state);

sockets.on('connection', (socket)=>
{
    const playerId = socket.id;
    console.log(`> Player connected on Server with id: ${playerId}`);
    game.addPlayer({id:playerId});
    socket.emit('setup', game.state)

    socket.on('disconnect', (socket)=>
    {
        game.removePlayer({id:playerId});
    });

    socket.on('move-player', (command)=>
    {
        command.playerId = playerId;
        command.type = 'move-player';

        game.movePlayer(command);
    });

});


server.listen(3000, ()=>
{
    console.log(`> Server listening on 3000`);
});