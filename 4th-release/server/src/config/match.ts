import { IMatchType } from "../models"

export interface IMatchTypes extends Map<string, IMatchType> {}
export interface IMatchModes extends Map<string, IMatchTypes> {}
export interface IMatchMode {
    name:string
    types:string[]
}

function createType (matchTypes : any) : IMatchTypes
{
    const t = new Map<string, IMatchType>();
    for(let key in matchTypes)
    {
        t.set(key, matchTypes[key]);
    }
    return t;
}

function createMode (matchModes : any) : IMatchModes
{
    const t = new Map<string, IMatchTypes>();
    for(let key in matchModes)
    {
        t.set(key, createType(matchModes[key]));
    }
    return t;
}

const types = createMode(
{
    "solo":
    {    
        "duelo": {
            max:2,
            squads:1
        },
        "lutinha": {
            max:4,
            squads:1
        },
        "batalha": {
            max:8,
            squads:1
        },
    },
    "coop":
    {
        "duelo": {
            max:4,
            squads:2
        },
        "dupla": {
            max:8,
            squads:4
        },
        "quadrilha": {
            max:8,
            squads:2
        },
    },
});

function modes () : IMatchMode[]
{
    const m = Array(...types.keys());
    return m.map(e => 
    {
        const mt = types.get(e) as IMatchTypes;
        const t : IMatchMode = {
            name:e,
            types:Array(...mt.keys())
        };
        return t;
    }) as IMatchMode[];
}

function gameType (mode:string, type : string) : IMatchType
{
    const m = types.get(mode);
    if(!m) return (null as unknown) as IMatchType;
    return m.get(type) as IMatchType;
}

export default {modes, gameType};