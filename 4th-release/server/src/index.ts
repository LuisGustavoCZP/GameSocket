import express from 'express';
import cookieParser from 'cookie-parser';

import Routes from "./router";
import Server from "./server";
import Connections from "./connection";

const app = express();

app.use(cookieParser());
app.use(express.json())
app.use(express.urlencoded({ extended: true}))

app.use(express.static('../client/build'));

app.use(Routes);

const server = new Server(app);
const connections = new Connections(server);

server.listen();
