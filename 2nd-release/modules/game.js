function createGame ()
{
    const state =
    {
        size:10,
        players:{},
        npcs:{},
        items:{},
    };

    function setState (newState)
    {
        Object.assign(state, newState);
    }

    function getState (ownerId)
    {
        const s = {
            size:state.size,
            objects:{}
        };

        for(const playerId in state.players)
        {
            const player = state.players[playerId];
            s.objects[playerId] = {
                x:player.x,
                y:player.y,
                color:playerId===ownerId?'rgba(0,0,255,0.1)':'gray', //'hsl(240, 100, 100)'
                id:playerId,
            }
        } 

        return s; 
    }

    function addPlayer (id, x=randomPos(), y=randomPos())
    {
        const newPlayer = {id, x, y};
        state.players[id] = newPlayer;
    }

    function removePlayer (id)
    {
        delete state.players[id];
    }

    function randomPos () 
    {
        return Math.floor(Math.random() * state.size);    
    }

    return {
        state,
        setState,
        getState,
        addPlayer,
        removePlayer
    }
}

export default createGame;