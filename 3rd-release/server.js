import https from 'https';
import http from 'http';
import fs from 'fs';
import game from './modules/game.js';
import router from './routes/index.js';
import connections from './modules/socket.js';

const options = {
    key: fs.readFileSync('./security/cert.key'),
    cert: fs.readFileSync('./security/cert.pem')
};

const server = http.createServer(router(game));
//const server = https.createServer(options, router(game));
connections(server);

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
    console.log(`> Server listening on http://localhost:3000`);
});
