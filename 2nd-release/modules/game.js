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
            const p = await getPlayer(playerId);
            s.objects[p.id] = p;
        } 

        return s;
    }

    async function addPlayer (id, session)
    {
        //session.character ? session.character :
        let character = await getCharacter(session.id_character);
        const newPlayer = {id, character:character.id, owner:character.owner, x:character.x, y:character.y};
        //console.log(newPlayer);
        state.players[id] = newPlayer;

        state.actions.changes[id] = await getPlayer(id);
        await startUpdateChanges();
    }

    async function removePlayer (id)
    {
        const oldPlayer = state.players[id];
        //const userId = oldPlayer.owner;
        const response = await database.query('UPDATE public.character SET (x, y)=($2, $3) WHERE id=$1 RETURNING id', [oldPlayer.character, oldPlayer.x, oldPlayer.y])
        .then(resp => resp.rows[0])
        .catch(err => 
        { 
            return err; 
        });

        state.actions.changes[id] = { delete:true };
        await startUpdateChanges();
        delete state.players[id];
        unregisterAction('update', id);
    }

    async function getPlayer (id)
    {
        const player = state.players[id];
        return {
            x:player.x,
            y:player.y,
            color:'rgba(0,0,255,0.1)', //'hsl(240, 100, 100)'
            id:id,
        };
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
        await startMoving();
    }

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

    function randomPos () 
    {
        return Math.floor(Math.random() * state.size);    
    }

    async function getCharacter (characterid)
    {
        const character = await database.query('SELECT * FROM public.character WHERE character.id=$1', [characterid])
        .then(resp => resp.rows[0])
        .catch(err => 
        { 
            return undefined; 
        });

        console.log("Character selected ", character);
        return character;
    }

    async function getCharacters (req, res)
    {
        const characters = await database.query('SELECT * FROM public.character WHERE character.owner=$1', [req.session.id_user])
        .then(resp => resp.rows)
        .catch(err => 
        { 
            return []; 
        });
        
        //console.log(characters);
        res.json(characters);
    }

    async function setCharacter (req, res)
    {
        const { id_character:characterid } = req.body;
        //console.log(characterid);
        const sessionid = await database.query('UPDATE public.session SET id_character=$2 WHERE id=$1 RETURNING id', [req.session.id, characterid])
        .then(resp => resp.rows[0])
        .catch(err => 
        { 
            return err; 
        });
        
        console.log("Character is ", sessionid);
        res.json(sessionid);
    }

    async function addCharacter (req, res)
    {
        const { charname:charName } = req.body;

        if(charName) 
        {
            const queryResponse = await database.query('INSERT INTO public.character (owner, name, x, y, points) VALUES ($1, $2, $3, $4, $5) RETURNING id', [req.session.id_user, charName, randomPos(), randomPos(), 0])
            .then(resp => resp.rows[0])
            .catch(err => 
            { 
                return undefined; 
            });

            if(queryResponse)
            {
                //console.log(queryResponse);
                res.json({sucess:true, content:queryResponse});
            }
            else 
            {
                res.json({sucess:false, content:"Nome indisponível"});
            }
            
        } 
        else 
        {
            
            res.end();
        }
    }

    async function newCharacter (session)
    {
        const character = {
            owner:session.id_user,
            x:randomPos(),
            y:randomPos()
        };

        //session.character = character;
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
        startUpdateChanges,
        registerAction,
        unregisterAction,
        addCharacter,
        getCharacters,
        setCharacter
    }
}

export default createGame;