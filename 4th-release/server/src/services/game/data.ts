import { Match, IMatchPlayer, IMatchSetup, IMatchType, IMatchSocket, IGameSetup } from "../../models";

import { uuid } from "../../utils";
import user from "../user";

const gameMatchs = new Map<string, GameMatch>();
const usersSocket = new Map<string, string>();

async function byUser (userId : string) : Promise<GameMatch | null> 
{
    const responseUser = await user.get(userId);
    if(!responseUser.data) return null;

    for(const match of gameMatchs.values())
    {
        if(match.players.filter(player => player && player.owner == responseUser.data.username).length > 0) return match;
    }
    return null;
}

async function create (matchSetup : IMatchSetup) : Promise<GameMatch>
{
    const match = new GameMatch(matchSetup);

    gameMatchs.set(match.id, match);

    return match;
}

async function destroy (id : string) : Promise<boolean>
{
    if(!gameMatchs.has(id)) return false;
    gameMatchs.delete(id);
    return true;
}

export const tileTypes =
{
    wall: {blocked: true, color: 'black', destructible:false},
    box: {blocked: true, color: 'brown', destructible:false},
}

export class MapTile
{
    public type : string;

    constructor (type : string)
    {
        this.type = type;
    }
}

export class GameMap 
{
    public types : any;
    public data : Array<MapTile>;
    public width : number;
    public height : number;

    constructor (width : number, height : number)
    {
        this.width = width;
        this.height = height;
        this.data = new Array<MapTile>(width*height);
        this.types = tileTypes;
        this.randomize ();
    }

    public randomize ()
    {
        let n = 0;
        for(let y = 0; y < this.height; y++)
        {
            for(let x = 0; x < this.width; x++)
            {
                let type = '';
                if(x == 0 || x == this.width-1) type = "wall";
                else if(y == 0 || y == this.height-1) type = "wall";
                else if(x % 2 == 0 && y % 2 == 0) type = "wall";
                else if(Math.random() > .6 && x != 1 && x != this.width-2 && y != 1 && y != this.height-2) type = "box";

                if(type != '') this.data[n] = new MapTile(type);
                
                //else this.data[n] = (null as unknown) as MapTile;
                n++;
            }
        }
    }
}

export class GamePlayer 
{
    protected index : number;
    protected socket : IMatchSocket;
    protected owner: string;
    //team:matchPlayer.team,
    protected _setup: IGameSetup | null;

    public x : number;
    public y : number;

    public get data () : any 
    {
        const gameMatch = {} as any;
        Object.keys(this).forEach(k => 
        {
            const t = this as any;
            const s = k.replace('_', '');
            gameMatch[s] = t[k];
        });

        return gameMatch;
    }

    constructor (matchPlayer : IMatchPlayer, x : number, y : number)
    {
        this.index = matchPlayer.index;
        this.socket = matchPlayer.socket;
        this.owner = matchPlayer.owner;
        //this.team = matchPlayer.team;
        this._setup = matchPlayer.setup;
        this.x = x;
        this.y = y;
    }
}

const playerPos = [
    [{x:1, y:1}, {x:-1, y:-1}],
    [{x:1, y:1}, {x:-1, y:-1}, {x:-1, y:1}, {x:1, y:-1}]
]

export class GameMatch
{
    protected _id: string;
    public players: any[];
    public map: GameMap;

    public get id () : string 
    {
        return this._id;
    }

    public get data () : any 
    {
        const gameMatch = {} as any;
        Object.keys(this).forEach(k => 
        {
            const t = this as any;
            const s = k.replace('_', '');
            gameMatch[s] = t[k];
        });

        return gameMatch;
    }

    constructor (matchSetup : IMatchSetup)
    {
        this._id = uuid();
        const psize = Math.floor(matchSetup.players.length / 2)-1;
        
        this.map = new GameMap(11, 11);
        this.players = matchSetup.players.map((matchPlayer, i) => 
        {
            const pattern = playerPos[psize][i];
            //const q = i % 2 == 0;
            const p : {x:number, y:number} = {x: pattern.x < 0? (this.map.width-1) + pattern.x : pattern.x, y: pattern.y < 0? (this.map.height-1) + pattern.y : pattern.y};
            return new GamePlayer(matchPlayer, p.x, p.y);
        });
    }

    public async start ()
    {
        this.sendPlayers("match-start", this.data);
    }

    public async sendPlayers (key : string, data : any = null)
    {
        this.players.forEach(player => 
        {
            if(player) player.socket.commander(key, data);
        });
    }
}

export default { byUser, create, destroy };