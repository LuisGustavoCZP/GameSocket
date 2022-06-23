import express from 'express';
import cookieParser from 'cookie-parser';
import auth from '../modules/auth.js';
import mapRoute from "./map.js";

function start (game) 
{
    const app = express();

    app.use(cookieParser());
    app.use(express.json())
    app.use(express.urlencoded({ extended: true}))

    app.use(express.static('public'));

    app.use("/map", mapRoute)

    app.post('/register', auth.register);

    app.post('/login', auth.login);

    app.post('/auth', auth.load);

    app.get('/characters', auth.token, game.getCharacters);

    app.post('/addcharacter', auth.token, game.addCharacter);

    app.put('/character', auth.token, game.setCharacter);

    return app;
}

export default start;