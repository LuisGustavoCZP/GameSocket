function startNetwork (session) 
{
    const token = session.id;
    const socket = io();

    function actionTest (e) 
    {
        //console.log(e);
        socket.emit('player-move', e);
    }
    inputManager.register(actionTest);

    socket.on('connect', ()=>
    {
        const playerId = socket.id;
        console.log(`Player connected on Client with id: ${playerId}`);
        socket.emit('auth', token);
    });

    socket.on('setup', (state)=>
    {
        const playerId = socket.id;
        console.log(`Player setup for Client with id: ${playerId}`, state);
        game.state = state;
        game.owner = playerId;
        gameRender.start();
        inputManager.start();
    });

    socket.on('game-update', (changes)=>
    {
        const playerId = socket.id;
        //console.log(`Game update`, changes);
        for(const pid in changes)
        {
            const p = changes[pid];
            if(game.state.objects[pid])
            {
                if(p.delete)
                {
                    delete game.state.objects[pid];
                }
                else 
                {
                    Object.assign(game.state.objects[pid], p);
                }
            }
            else 
            {
                game.state.objects[pid] = p;
            }
        }
        //
    });

    socket.on('disconnect', ()=>
    {
        const playerId = socket.id;
        console.log(`Player disconnected on Client with id: ${playerId}`);
        gameRender.stop();
        inputManager.stop();
    });
}

export default startNetwork;