import express from 'express';
import cookieParser from 'cookie-parser';
import { PeerServer } from 'peer';

import Routes from "./router";
import Server from "./server";
import Connections from "./connection";

const app = express();

/* const peerServer = PeerServer({ port: 9000, path: '/myapp' }); */

app.use(cookieParser());
app.use(express.json())
app.use(express.urlencoded({ extended: true}))

app.use(express.static('../client/build'));

app.use(Routes);

const server = new Server(app);
const connections = new Connections(server);

server.listen();
