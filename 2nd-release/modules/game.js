function createGame ()
{
    const state =
    {
        size:10,
        players:{},
        npcs:{},
        items:{},
        actions:
        {
            move:{},
        }
    };

    const actionEvents = { move:{} };

    function registerAction (type, e)
    {
        actionEvents[type][e.name] = e;
    }

    function unregisterAction (type, e)
    {
        delete actionEvents[type][e.name];
    }

    let updatingMove = false;

    function getAction (type, id)
    {
        const act = state.actions[type][id];
        if(!act) {
            state.actions[type][id] = {};
            return state.actions[type][id];
        }
        return act;
    }

    const inputActions = {
        ArrowUp (id)
        {
            const act = getAction('move', id);
            act.y = -1;
        },
        ArrowDown(id)
        {
            const act = getAction('move', id);
            act.y = 1;
        },
        ArrowLeft(id)
        {
            const act = getAction('move', id);
            act.x = -1;
        },
        ArrowRight(id)
        {
            const act = getAction('move', id);
            act.x = 1;
        },
    }

    function setState (newState)
    {
        Object.assign(state, newState);
    }

    function getState ()
    {
        const s = {
            size:state.size,
            objects:{}
        };

        for(const playerId in state.players)
        {
            const p = getPlayer(playerId);
            s.objects[p.id] = p;
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

    function getPlayer (id)
    {
        const player = state.players[id];
        return {
            x:player.x,
            y:player.y,
            color:'rgba(0,0,255,0.1)', //'hsl(240, 100, 100)'
            id:id,
        };
    }

    function movePlayer (id, input)
    {
        //console.log(`Player ${id} pressed`, input);
        const player = state.players[id];
        if(!player) return;
        for(const i in input)
        {
            const inputAction = inputActions[i];
            if(!inputAction) continue;
            inputAction(id);
        }
        startMoving();
    }

    function moveUpdate ()
    {
        updatingMove = false;

        const moveActions = state.actions.move;
        //console.log("Movendo ", moveActions);

        const changes = {};
        for(const actorId in moveActions)
        {
            const action = moveActions[actorId];
            const player = state.players[actorId];

            if(!player) continue;
            
            if(action.x) 
            {
                if(action.x > 0 && player.x < state.size-1 || action.x < 0 && player.x > 0) player.x += action.x;  
            };
            if(action.y) 
            {
                if(action.y > 0 && player.y < state.size-1 || action.y < 0 && player.y > 0) player.y += action.y;
            };

            delete moveActions[actorId];
            changes[actorId] = getPlayer(actorId);
        }

        for(const ev in actionEvents.move)
        {
            actionEvents.move[ev](changes);
        }
    }

    function startMoving ()
    {
        if(updatingMove) return;
        updatingMove = true;
        setTimeout(moveUpdate, 150);
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
        removePlayer,
        getPlayer,
        movePlayer,
        registerAction,
        unregisterAction
    }
}

export default createGame;