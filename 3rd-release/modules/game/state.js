import player from "./player.js";

const state =
{
    size:32,
    players:{},
    npcs:{},
    items:{},
    actions:
    {
        move:{},
        changes:{},
    },
    
};

function randomPos () 
{
    return Math.floor(Math.random() * state.size);    
}

async function setState (newState)
{
    Object.assign(state, newState);
}

async function getState ()
{
    const s = {
        size:state.size,
        objects:{}
    };

    for(const playerId in state.players)
    {
        const p = await player.get(playerId);
        s.objects[p.id] = p;
    } 

    return s;
}


console.log("Running state!");

export default state;
export {randomPos, setState, getState};