import database from "../../database/database.js";
import {randomPos} from "./state.js";

async function getCharacter (characterid)
{
    const character = await database.get("character", characterid)
    //database.query('SELECT * FROM public.character WHERE character.id=$1', [characterid])
    .then(resp => resp)
    .catch(err => 
    { 
        return undefined; 
    });

    //console.log("Character selected ", character);
    return character;
}

async function getCharacters (req, res)
{
    const characters = await database.select("character", "owner", req.session.id_user)
    //database.query('SELECT * FROM public.character WHERE character.owner=$1', [req.session.id_user])
    .then(resp => resp)
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
    console.log(characterid, "\n", req.session.id);
    const sessionid = await database.update("session", req.session.id, {id_character:characterid})
    //database.query('UPDATE public.session SET id_character=$2 WHERE id=$1 RETURNING id', [req.session.id, characterid])
    .then(resp => resp)
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
        const queryResponse = await database.insert("character", {owner:req.session.id_user, name:charName, x:randomPos(), y:randomPos(), points:0})
        //database.query('INSERT INTO public.character (owner, name, x, y, points) VALUES ($1, $2, $3, $4, $5) RETURNING id', [req.session.id_user, charName, randomPos(), randomPos(), 0])
        .then(resp => resp)
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

async function saveCharacter (oldPlayer)
{
    const response = await database.update("character", oldPlayer.character, {x:oldPlayer.x, y:oldPlayer.y})
    //database.query('UPDATE public.character SET (x, y)=($2, $3) WHERE id=$1 RETURNING id', [oldPlayer.character, oldPlayer.x, oldPlayer.y])
    .then(resp => resp)
    .catch(err => 
    { 
        return err; 
    });
}

export default {
    getCharacter, 
    getCharacters,
    setCharacter,
    addCharacter,
    newCharacter,
    saveCharacter
}