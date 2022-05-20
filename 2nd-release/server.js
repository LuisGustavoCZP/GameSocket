import express from 'express';
import http from 'http';
import cookieParser from 'cookie-parser';
import { Server } from 'socket.io';
import createGame from './modules/game.js';
import database from './database/database.js';

const app = express();
const server = http.createServer(app);
const sockets = new Server(server);
const game = createGame();

app.use(cookieParser());
app.use(express.json())
app.use(express.urlencoded({ extended: true}))

app.use(express.static('public'));

app.post('/register', (req, res) => 
{
    const { username, userpass } = req.body;
    const id = database.users.create(username, userpass);
    res.json(id);
});

app.post('/login', (req, res) => 
{
    console.log(req.body);
    const { username, userpass } = req.body;
    if(username && userpass)
    {
        const id = database.users.check(username, userpass);
        res.json(id);
    }
    else 
    {
        res.json(false);
    }
});

const o = "coisa";

app.post('/auth', (req, res) => 
{
    //console.log(req.cookies);
    res.json(false);
});

sockets.on('connection', (socket) =>
{
    const playerId = socket.id;
    console.log(`> Player connected on Server with id: ${playerId}`);

    socket.on('auth', (auth)=> 
    {
        if(!auth || auth !== o)
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
