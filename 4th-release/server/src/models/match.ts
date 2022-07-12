interface Match {
    id: string
    type: string
    createdAt: string
    completedAt: string | null
    players: string[]
}

export default Match;