function createGame () 
{
    const state = {
        size:10,
        current: undefined,
        players: {},
        fruits: {}
    }

    const acceptedMoves = {
        ArrowUp(player)
        {
            if(player.y > 0) player.y--;
        },
        ArrowDown(player)
        {
            if(player.y < state.size-1) player.y++;
        },
        ArrowLeft(player)
        {
            if(player.x > 0) player.x--;
        },
        ArrowRight(player)
        {
            if(player.x < state.size-1) player.x++;
        },
    }

    function movePlayer(command) 
    {
        const { id, keyPressed } = command;
        //console.log(`Moving ${id} with ${keyPressed}`);
        const player = state.players[id];
        const moveFunction = acceptedMoves[keyPressed];
        if(moveFunction && player) 
        {
            moveFunction(player);
            checkForFuitCollision(player);
        }
    }

    function checkForFuitCollision (player)
    {
        for(const fruitId in state.fruits)
        {
            const fruit = state.fruits[fruitId];
            console.log(`Checking ${player.id} and ${fruitId}`)
            if(player.x === fruit.x && player.y === fruit.y) 
            {
                console.log(`Collision between ${player.id} and ${fruitId}`)
                player.points += fruit.points;
                removeFruit({id:fruitId});
            }
        }
    }

    function addPlayer (command)
    {
        const { id, x, y } = command;
        state.players[id] = { id, x, y, points:0 };
    }

    function removePlayer (command)
    {
        const { id } = command;
        delete state.players[id];
    }

    function selectPlayer (command)
    {
        const { id } = command;
        state.current = id;
    }

    function addFruit (command)
    {
        const { id, x, y, points } = command;
        state.fruits[id] = { id, x, y, points };
    }

    function removeFruit (command)
    {
        const { id } = command;
        delete state.fruits[id];
    }

    return {
        state,
        addPlayer,
        removePlayer,
        selectPlayer,
        movePlayer,
        addFruit,
        removeFruit,
    }
}

export default createGame ();