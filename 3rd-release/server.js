import https from 'https';
import fs from 'fs';
import { Server } from 'socket.io';
import createGame from './modules/game.js';
import auth from './modules/auth.js';
import router from './routes/index.js';

const options = {
    key: fs.readFileSync('./security/cert.key'),
    cert: fs.readFileSync('./security/cert.pem')
};

const game = createGame();

const server = https.createServer(options, router(game));
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
  
server.listen(3000, () =>
{
    console.log(`> Server listening on https://localhost:3000`);
});
