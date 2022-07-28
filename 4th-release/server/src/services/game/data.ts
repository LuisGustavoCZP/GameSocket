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
        if(match.players.filter(player => player && player.getOwner == responseUser.data.username).length > 0) return match;
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

export type Position =
{
    x:number, y:number
}

export type Objective =
{
    playerIndex:number
    order:string
    path:Position[]
}

export class GamePlayer 
{
    protected index : number;
    protected socket : IMatchSocket;
    protected owner: string;
    //team:matchPlayer.team,
    protected setup: IGameSetup | null;

    /* public objective : Position | null; */
    public position : Position;

    public get ID ()
    {
        return this.socket.id;
    }

    public get getIndex ()
    {
        return this.index;
    }

    public get getOwner ()
    {
        return this.owner;
    }

    public get getSetup ()
    {
        return this.setup;
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

    constructor (matchPlayer : IMatchPlayer, position : Position)
    {
        this.index = matchPlayer.index;
        this.socket = matchPlayer.socket;
        this.owner = matchPlayer.owner;
        //this.team = matchPlayer.team;
        this.setup = matchPlayer.setup;
        this.position = position;
        /* this.objective = null; */
    }

    public send (key : string, data : any = null)
    {
        this.socket.commander(key, data);
    }
}

const playerPos = [
    [{x:1, y:1}, {x:-1, y:-1}],
    [{x:1, y:1}, {x:-1, y:-1}, {x:-1, y:1}, {x:1, y:-1}]
]

function diference (posA : Position, posB : Position)
{
    return {
        x: posA.x - posB.x,
        y: posA.y - posB.y
    };
}

function distance (posA : Position, posB : Position)
{
    const dif = diference(posA, posB);
    return {
        x:Math.abs(dif.x),
        y:Math.abs(dif.y)
    };
}

function normalize (pos : Position)
{
    return {
        x: pos.x/Math.abs(pos.x),
        y: pos.y/Math.abs(pos.y)
    };
}

export class GameMatch
{
    protected _id: string;
    public players: GamePlayer[];
    public map: GameMap;
    protected _objectives : any;
    private executingObjectives : boolean;

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
            const pos : {x:number, y:number} = {x: pattern.x < 0? (this.map.width-1) + pattern.x : pattern.x, y: pattern.y < 0? (this.map.height-1) + pattern.y : pattern.y};
            return new GamePlayer(matchPlayer, pos);
        });

        this._objectives = {};
        this.executingObjectives = false;
    }

    public async start ()
    {
        this.sendPlayers("match-start", this.data);
    }

    public async update ()
    {
        this.sendPlayers("game-update", this.data);
    }

    public async executeObjectives ()
    {
        const speed = 0.1;
        this.executingObjectives = true;
        const objectives = this._objectives;

        for(const order in objectives) 
        {
            const orderObjectives = objectives[order];
            
            for(const playerIndex in orderObjectives)
            {
                const objective = orderObjectives[playerIndex];
                const player = this.players[Number(playerIndex)];
                if(!player || objective.path.length == 0) /* objective.order == 'go' &&  */
                {
                    delete this._objectives[order][playerIndex];
                    if(Object.keys(this._objectives[order]).length == 0) delete this._objectives[order];
                }
                else 
                {
                    const pos = objective.path[0];
                    const dif = diference(player.position, pos)
                    const dist = {
                        x:Math.abs(dif.x),
                        y:Math.abs(dif.y)
                    };
    
                    const onX = dist.x < speed;
                    const onY = dist.y < speed;
    
                    if(onX && dist.x != 0) player.position.x = pos.x;
                    if(onY && dist.y != 0) player.position.y = pos.y;
    
                    if(onX && onY) 
                    {
                        objective.path.splice(0, 1);
                    }
                    else 
                    {
                        if(dist.x > 0) player.position.x -= dif.x/dist.x*speed;
                        if(dist.y > 0) player.position.y -= dif.y/dist.y*speed;
                    }
                }
            }
        };

        await this.update();

        if(Object.keys(this._objectives).length == 0)
        {
            this.executingObjectives = false;
        }
        else 
        {
            setTimeout(() => {this.executeObjectives()}, 100);
        }
    }

    public async orderGoTo (playerIndex : number, position : Position)
    {
        const player = this.players[playerIndex];
        const dif = diference(player.position, position)
        const dist = {
            x:Math.abs(dif.x),
            y:Math.abs(dif.y)
        };

        const path = [];
        if(dist.x < dist.y)
        {
            path.push({x:position.x, y:player.position.y});
            path.push({x:position.x, y:position.y});
        }
        else
        {
            path.push({x:player.position.x, y:position.y});
            path.push({x:position.x, y:position.y});
        }

        if(!this._objectives['go']) this._objectives['go'] = {};
        this._objectives['go'][playerIndex] = {playerIndex, order:'go', path};
        
        //this._objectives.push();
        if(!this.executingObjectives) this.executeObjectives();
    }

    public async sendPlayers (key : string, data : any = null)
    {
        this.players.forEach(player => 
        {
            if(player) player.send(key, data);
        });
    }
}

export default { byUser, create, destroy };