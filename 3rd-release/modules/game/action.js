import state from "./state.js";

const actionEvents = { update:{} };

function registerAction (type, playerId, e)
{
    actionEvents[type][playerId] = e;
}

function unregisterAction (type, playerId)
{
    delete actionEvents[type][playerId];
}

function getAction (type, id)
{
    const act = state.actions[type][id];
    if(!act) {
        state.actions[type][id] = {};
        return state.actions[type][id];
    }
    return act;
}

function addAction (id, obj)
{
    state.actions.changes[id] = obj;
}

function deleteAction (id)
{
    state.actions.changes[id] = { delete:true };
}

let updatingChanges = false;
async function updateChanges ()
{
    updatingChanges = false;
    for(const ev in actionEvents.update)
    {
        actionEvents.update[ev](state.actions.changes);
    }
}

async function startUpdateChanges ()
{
    if(updatingChanges) return;
    updatingChanges = true;
    setTimeout(updateChanges, 50);
}

let updatingMove = false;
async function moveUpdate ()
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

    await startUpdateChanges();
}

async function startMoving ()
{
    if(updatingMove) return;
    updatingMove = true;
    setTimeout(moveUpdate, 100);
}

export default {
    actionEvents,
    registerAction,
    unregisterAction,
    getAction,
    addAction,
    deleteAction,
    startUpdateChanges,
    startMoving,
}