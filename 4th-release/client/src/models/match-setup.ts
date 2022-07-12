import {IMatchPlayer, IMatchType} from './';

interface IMatchSetup {
    id: string
    type: string
    createdAt: string
    players: IMatchPlayer[]
    confirmations: number
    startedAt: string | null
    waitTimer: number | null
    configs: IMatchType
}

export default IMatchSetup;