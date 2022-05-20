import express from 'express';
import http from 'http';
import cookieParser from 'cookie-parser';
import { Server } from 'socket.io';
import createGame from './modules/game.js';
import auth from './modules/auth.js';
import crypto from 'crypto';

const app = express();
const server = http.createServer(app);
const sockets = new Server(server);
const game = createGame();

app.use(cookieParser());
app.use(express.json())
app.use(express.urlencoded({ extended: true}))

app.use(express.static('public'));

app.post('/register', auth.register);

app.post('/login', auth.login);

const o = "coisa";

app.post('/auth', auth.load);

sockets.on('connection', (socket) =>
{
    const playerId = socket.id;
    console.log(`> Player connected on Server with id: ${playerId}`);

    socket.on('auth', (token)=> 
    {
        const user = auth.check(token);
        if(!user)
        {
            socket.disconnect(true);
            return;
        }

        let character = user.character ? user.character : game.newCharacter(user);

        game.addPlayer(playerId, character);
        socket.on('disconnect', (socket)=>
        {
            game.removePlayer(playerId);
            console.log(`> Player disconnected on Server with id: ${playerId}`);
        });
    
        game.registerAction('move', (ev)=>
        {
            //console.log(`Sending`, ev);
            socket.emit('game-update', ev);
        });

        socket.emit('setup', game.getState(playerId));

        socket.on('player-move', (input)=>
        {
            game.movePlayer(playerId, input);
        });
    });
});

server.on('close', (socket) =>
{
    console.log(`Closing server`);
});

const runBeforeExiting = () => 
{
    const exitSignals = ['exit', 'SIGINT', 'SIGUSR1', 'SIGUSR2', 'uncaughtException'];
    for (const signal of exitSignals) {
        process.on(signal, async () => 
        {
            server.close();
        });
    }
};
//runBeforeExiting ();
  
server.listen(3000, () =>
{
    console.log(`> Server listening on http://localhost:3000`);
});
