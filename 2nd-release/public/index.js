import createGameRender from "./render.js";

const game = {};
const socket = io();

socket.on('connect', ()=>
{
    const playerId = socket.id;
    console.log(`Player connected on Client with id: ${playerId}`);
    socket.emit('auth', true);
});

socket.on('setup', (state)=>
{
    const playerId = socket.id;
    console.log(`Player setup for Client with id: ${playerId}`, state);
    game.state = state;
    window.gameRender = createGameRender(game);
    gameRender.start();
});

socket.on('disconnect', ()=>
{
    const playerId = socket.id;
    console.log(`Player disconnected on Client with id: ${playerId}`);
});
