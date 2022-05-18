import keyboardListener from "./keyboardListener.js";
import createGame from "./game.js";
import createGameRender from "./gameRender.js"

const game = createGame();
const gameRender = createGameRender(game);

const socket = io();

socket.on('connect', ()=>
{
    const playerId = socket.id;
    console.log(`Player connected on Client with id: ${playerId}`)
});

socket.on('disconnect', ()=>
{
    const playerId = socket.id;
    keyboardListener.clear();
});

socket.on('setup', (state)=>
{
    const playerId = socket.id;
    console.log(`Receiving setup`, state);
    game.setState(state);

    game.current = playerId;
    keyboardListener.registerPlayerId(playerId);
    //keyboardListener.subscribe(game.movePlayer);
    keyboardListener.subscribe((command) => 
    {
        socket.emit('move-player', command);
    });
});

socket.on('add-player', (command)=>
{
    console.log(`Receiving ${command.type}`, command);
    game.addPlayer(command);
});

socket.on('remove-player', (command)=>
{
    console.log(`Receiving ${command.type}`, command);
    game.removePlayer(command);
});

socket.on('move-player', (command)=>
{
    console.log(`Receiving ${command.type}`, command);
    const playerId = socket.id;

    //if(playerId !== command.playerId)
        game.movePlayer(command);
});

socket.on('add-fruit', (command)=>
{
    console.log(`Receiving ${command.type}`, command);
    game.addFruit(command);
});

socket.on('remove-fruit', (command)=>
{
    console.log(`Receiving ${command.type}`, command);
    game.removeFruit(command);
});

socket.on('player-points', (command)=>
{
    console.log(`Receiving ${command.type}`, command);
    game.state.players[command.id].points = command.points;
});