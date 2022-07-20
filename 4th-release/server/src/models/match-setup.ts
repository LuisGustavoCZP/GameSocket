import {IMatchPlayer, IMatchType} from "./"

interface IMatchSetup {
    id: string
    type: string
    createdAt: string
    players: IMatchPlayer[]
    slotsMask : number
    slotsUsing : number
    confirmations: number
    startedAt: string | null
    waitTimer: number | null
    configs: IMatchType
    subscribe: (arg0 : IMatchPlayer) => Promise<number>
    unsubscribe: (arg0 : IMatchPlayer) => Promise<number>
    confirm: (arg0 : string) => Promise<number>
    unconfirm: (arg0 : string) => Promise<number>
    getPlayer: (arg0 : string) => Promise<IMatchPlayer>
    confirmed: (arg0 : number) => boolean
    start: () => Promise<void>
}

export default IMatchSetup;