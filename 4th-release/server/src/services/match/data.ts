import { Match, IMatchPlayer, IMatchSetup, IMatchType } from "../../models";
import { matchConfig } from "../../config"
import { uuid } from "../../utils";
import user from "../user";

const matchSetups = new Map<string, MatchSetup>();
const usersSocket = new Map<string, string>();

async function uncompleted (type : string) : Promise<MatchSetup[]> 
{
    const sm = type.split("-");
    const typeConfig = matchConfig.gameType(sm[0], sm[1]);

    const founds = [];
    for(const match of matchSetups.values())
    {
        if(match.type == type && match.slotsUsing < match.slotsMask) founds.push(match);
    }
    return founds;
}

async function byUser (userId : string) : Promise<MatchSetup | null> 
{
    const responseUser = await user.get(userId);
    if(!responseUser.data) return null;

    for(const match of matchSetups.values())
    {
        if(match.players.filter(player => player && player.owner == responseUser.data.username).length > 0) return match;
    }
    return null;
}

async function create (type : string) : Promise<MatchSetup>
{
    const match = new MatchSetup(type);

    matchSetups.set(match.id, match);

    return match;
}

async function destroy (id : string) : Promise<boolean>
{
    if(!matchSetups.has(id)) return false;
    matchSetups.delete(id);
    return true;
}

class MatchSetup implements IMatchSetup
{
    protected _id: string;
    protected _type: string;
    protected _createdAt: string;
    public players: IMatchPlayer[];
    protected _slotsMask : number;
    protected _slotsUsing: number;
    protected _confirmations: number;
    protected _startedAt: string;
    protected _waitTimer: number;
    public configs: IMatchType;

    public get id () : string 
    {
        return this._id;
    }

    public get type () : string 
    {
        return this._type;
    }

    public get createdAt () : string 
    {
        return this._createdAt;
    }

    public get slotsMask () : number 
    {
        return this._slotsMask;
    }

    public get slotsUsing () : number 
    {
        return this._slotsUsing;
    }

    public get confirmations () : number 
    {
        return this._confirmations;
    }

    public get waitTimer () : number 
    {
        return this._waitTimer;
    }

    public get startedAt () : string 
    {
        return this.startedAt;
    }

    constructor (type : string)
    {
        this._id = uuid();
        this._type = type;
        this._createdAt = new Date().toISOString();
        const sm = type.split("-");
        this.configs = matchConfig.gameType(sm[0], sm[1]);
        this.players = new Array<IMatchPlayer>(this.configs.max);
        this._slotsMask = (2**this.configs.max) - 1;
        this._slotsUsing = 0;
        this._confirmations = 0;
        this._startedAt = '';
        this._waitTimer = matchConfig.initWait;
    }

    public async confirm(playerId : string) : Promise<number>
    {
        const p = await this.getPlayer(playerId);
        if(!p) 
        {
            console.log(playerId);
            return -1;
        }

        console.log(p.index, p.socket, playerId);
        if(!this.confirmed(p.index))
        {
            this._confirmations += 1 << p.index;
        }

        this.update ();
        if(this._confirmations == this._slotsMask) this.start();

        return this.confirmations;
    }

    public async unconfirm(playerId : string) : Promise<number>
    {
        const p = await this.getPlayer(playerId);
        if(!p) 
        {
            console.log(playerId);
            return -1;
        }
        
        if(this.confirmed(p.index))
        {
            this._confirmations -= 1 << p.index;
        }

        this.update ();

        return this.confirmations;
    }

    public async subscribe(player : IMatchPlayer) : Promise<number>
    {
        player.index = this.players.findIndex(value => !value);
        this._slotsUsing += 1 << player.index;

        this.players[player.index] = (player);

        this.update ();

        return player.index;
    }
    
    public async unsubscribe(player: IMatchPlayer) : Promise<number>
    {
        this._slotsUsing -= 1 << player.index;
        if(this.confirmed(player.index))
        {
            this._confirmations -= 1 << player.index;
        }
        this.players[player.index] = (null as unknown) as IMatchPlayer;
        if(this.slotsUsing == 0) await destroy(this.id);
        //console.log(this);

        this.update ();
        return player.index;
    }
    
    public async getPlayer(playerId : string) : Promise<IMatchPlayer>
    {
        const i = this.players.findIndex(player => 
        {
            return player && player.socket && player.socket.id == playerId
        });
        return this.players[i]; 
    }

    public confirmed(index : number) : boolean 
    {
        return ((this.confirmations & (1 << index)) > 0);
    }

    public async cancel ()
    {
        //console.log(this);
        this._waitTimer = matchConfig.initWait;
    }

    public async start ()
    {
        console.log("Iniciating match!");
        const match = this;
        const timer = (callback : (key : string, data:any)=>{}) =>
        {
            if(match._confirmations < match._slotsMask)
            {
                console.log("Iniciação foi cancelada porque alguém desconfirmou");
                match.cancel ();
                return;
            }
            else if(match._slotsUsing < match._slotsMask)
            {
                console.log("Iniciação foi cancelada porque alguém saiu");
                match.cancel ();
                return;
            }
            

            if(match._waitTimer > 0) 
            {
                match._waitTimer--;
                callback("match-starting", match._waitTimer);
                setTimeout(() => timer(callback), 1000);
                return;
            }
        }
        timer((key : string, data:any) => match.sendPlayers(key, data));
    }

    public async update ()
    {
        const matchSetup = {} as any;
        Object.keys(this).forEach(k => 
        {
            const t = this as any;
            const s = k.replace('_', '');
            if(s == "players")
            {
                const ps : any = [];
                t[k].forEach((p : any) => 
                {    
                    const np = Object.assign({}, p);
                    if(p && p.socket) np.socket = p.socket.id;
                    ps.push(np);
                });
                matchSetup[s] = ps;
            }
            else matchSetup[s] = t[k];
        });
        //console.log(matchSetup);
        await this.sendPlayers("match-update", matchSetup);
    }

    public async sendPlayers (key : string, data : any = null)
    {
        //console.log("Checando", this);
        this.players.forEach(player => 
        {
            if(player) player.socket.commander(key, data);
        });
    }
}

export { MatchSetup, matchSetups };
export default { uncompleted, byUser, create, usersSocket };
