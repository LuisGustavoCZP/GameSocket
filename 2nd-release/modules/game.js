import database from "../database/database.js";

function createGame ()
{
    const state =
    {
        size:20,
        players:{},
        npcs:{},
        items:{},
        actions:
        {
            move:{},
            changes:{},
        },
        
    };

    const actionEvents = { update:{} };

    function registerAction (type, playerId, e)
    {
        actionEvents[type][playerId] = e;
    }

    function unregisterAction (type, playerId)
    {
        delete actionEvents[type][playerId];
    }

    let updatingMove = false;
    let updatingChanges = false;

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

    function addPlayer (id, character)
    {
        const newPlayer = {id, owner:character.owner, x:character.x, y:character.y};
        state.players[id] = newPlayer;

        state.actions.changes[id] = getPlayer(id);
        startUpdateChanges();
    }

    function removePlayer (id)
    {
        //const oldPlayer = state.players[id];
        //const userId = oldPlayer.owner;
        state.actions.changes[id] = { delete:true };
        startUpdateChanges();
        delete state.players[id];
        unregisterAction('update', id);
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

        //const changes = {};
        for(const actorId in moveActions)
        {
            const action = moveActions[actorId];
            const player = state.players[actorId];
            const change = {};
            if(!player) continue;
            
            if(action.x) 
            {
                if(action.x > 0 && player.x < state.size-1 || action.x < 0 && player.x > 0) 
                { 
                    player.x += action.x; 
                    change.x = player.x;
                }
            };
            if(action.y) 
            {
                if(action.y > 0 && player.y < state.size-1 || action.y < 0 && player.y > 0)
                { 
                    player.y += action.y;
                    change.y = player.y;
                }
            };

            delete moveActions[actorId];
            //const obj = getPlayer(actorId);
            state.actions.changes[actorId] = change;
        }

        startUpdateChanges();
    }

    function startMoving ()
    {
        if(updatingMove) return;
        updatingMove = true;
        setTimeout(moveUpdate, 100);
    }

    function updateChanges ()
    {
        updatingChanges = false;
        for(const ev in actionEvents.update)
        {
            actionEvents.update[ev](state.actions.changes);
        }
    }

    function startUpdateChanges ()
    {
        if(updatingChanges) return;
        updatingChanges = true;
        setTimeout(updateChanges, 50);
    }

    function randomPos () 
    {
        return Math.floor(Math.random() * state.size);    
    }

    function newCharacter (user)
    {
        const character = {
            owner:user.id,
            x:randomPos(),
            y:randomPos()
        };

        user.character = character;
        return character;
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
        unregisterAction,
        newCharacter,
        startUpdateChanges
    }
}

export default createGame;