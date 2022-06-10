import express from 'express';
import https from 'https';
import fs from 'fs';
import cookieParser from 'cookie-parser';
import { Server } from 'socket.io';
import createGame from './modules/game.js';
import auth from './modules/auth.js';
import crypto from 'crypto';

const app = express();

const options = {
    key: fs.readFileSync('./security/cert.key'),
    cert: fs.readFileSync('./security/cert.pem')
};

const server = https.createServer(options, app);
const sockets = new Server(server);
const game = createGame();

app.use(cookieParser());
app.use(express.json())
app.use(express.urlencoded({ extended: true}))

app.use(express.static('public'));

app.post('/register', auth.register);

app.post('/login', auth.login);

app.post('/auth', auth.load);

app.get('/characters', auth.token, game.getCharacters);

app.post('/addcharacter', auth.token, game.addCharacter);

app.put('/character', auth.token, game.setCharacter);

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
        
        game.registerAction('update', playerId, (ev)=>
        {
            socket.emit('game-update', ev);
        });

        await game.addPlayer(playerId, session);
        
        socket.on('disconnect', async (socket)=>
        {
            await game.removePlayer(playerId);
            console.log(`> Player disconnected on Server with id: ${session.id_user}`);
        });

        socket.emit('setup', await game.getState(playerId));

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
