import action from "./action.js";
import character from "./character.js";
import state from "./state.js";

async function add (id, session)
{
    //session.character ? session.character :
    let _character = await character.getCharacter(session.id_character);
    const newPlayer = {id, character:_character.id, owner:_character.owner, x:_character.x, y:_character.y};
    //console.log(newPlayer);
    state.players[id] = newPlayer;

    action.addAction(id, await get(id));
    await action.startUpdateChanges();
}

async function remove (id)
{
    const oldPlayer = state.players[id];
    //const userId = oldPlayer.owner;

    character.saveCharacter(oldPlayer);
    
    action.deleteAction(id);
    await action.startUpdateChanges();
    delete state.players[id];
    action.unregisterAction('update', id);
}

async function get (id)
{
    const player = state.players[id];
    return {
        x:player.x,
        y:player.y,
        color:'rgba(0,0,255,0.1)', //'hsl(240, 100, 100)'
        id:id,
    };
}

export default {add, remove, get};