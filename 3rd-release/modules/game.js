import state from "./game/state.js";
import action from "./game/action.js";

const inputActions = {
    ArrowUp (id)
    {
        const act = action.getAction('move', id);
        act.y = -1;
    },
    ArrowDown(id)
    {
        const act = action.getAction('move', id);
        act.y = 1;
    },
    ArrowLeft(id)
    {
        const act = action.getAction('move', id);
        act.x = -1;
    },
    ArrowRight(id)
    {
        const act = action.getAction('move', id);
        act.x = 1;
    },
}

async function movePlayer (id, input)
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
    await action.startMoving();
}

export default {
    movePlayer
}