import { Match, IMatchPlayer, IMatchSetup, IMatchType } from "../../models";
import { matchConfig } from "../../config"
import { uuid } from "../../utils";
import user from "../user";

const matchSetups = new Map<string, IMatchSetup>();
const usersSocket = new Map<string, string>();

async function uncompleted (type : string) : Promise<IMatchSetup[]> 
{
    const sm = type.split("-");
    const typeConfig = matchConfig.gameType(sm[0], sm[1]);

    const founds = [];
    for(const match of matchSetups.values())
    {
        if(match.type == type && match.players.length < typeConfig.max) founds.push(match);
    }
    return founds;
}

async function byUser (userId : string) : Promise<IMatchSetup | null> 
{
    const responseUser = await user.get(userId);
    if(!responseUser.data) return null;

    for(const match of matchSetups.values())
    {
        if(match.players.filter(player => player.owner == responseUser.data.username).length > 0) return match;
    }
    return null;
}

async function create (type : string) : Promise<IMatchSetup>
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
    public id: string;
    public type: string;
    public createdAt: string;
    public players: IMatchPlayer[];
    public confirmations: number;
    public startedAt: string | null;
    public waitTimer: number | null;
    public configs: IMatchType;

    constructor (type : string)
    {
        this.id = uuid();
        this.type = type;
        this.createdAt = new Date().toISOString();
        this.players = [] as IMatchPlayer[];
        const sm = type.split("-");
        this.configs = matchConfig.gameType(sm[0], sm[1]);
        this.confirmations = (2**this.configs.max) - 1;
        this.startedAt = null;
        this.waitTimer = null;
    }

    public async confirm(playerId : string) : Promise<number>
    {
        const id = this.players.findIndex(player => 
        {
            console.log(player.socket, playerId);
            return player.socket == playerId;
        });
        const v = 2**id;
        console.log(id, v, playerId);
        if(this.confirmations >= v)
        {
            this.confirmations -= v;
        }

        return this.confirmations;
    }

    public async unconfirm(playerId : string) : Promise<number>
    {
        const id = this.players.findIndex(player => player.socket == playerId);
        const v = 2**id;
        if(this.confirmations < v)
        {
            this.confirmations += v;
        }

        return this.confirmations;
    }

    public async subscribe(player : IMatchPlayer) : Promise<number>
    {
        player.index = this.players.length;
        this.players.push(player);
        return player.index;
    }
    
    public async unsubscribe(player: IMatchPlayer) : Promise<number>
    {
        this.players.splice(player.index, 1);
        if(this.players.length == 0) await destroy(this.id);
        console.log(this.players);
        return player.index;
    }
    
    public async getPlayer(playerId : string) : Promise<IMatchPlayer>
    {
        const i = this.players.findIndex(player => player.socket == playerId);
        return this.players[i];
    }
}

export { MatchSetup, matchSetups };
export default { uncompleted, byUser, create, usersSocket };
