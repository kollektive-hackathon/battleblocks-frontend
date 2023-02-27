export const GameStatusEnum = {
    Created: 'CREATED',
    Playing: 'PLAYING',
    Finished: 'FINISHED'
} as const

type GameStatus = (typeof GameStatusEnum)[keyof typeof GameStatusEnum]

export type Game = {
    id: number
    ownerId: number
    ownerUsername: string
    stake: number
    timeCreated: number
    challengerId?: number
    challengerUsername?: string
    gameStatus?: GameStatus
    timeStarted?: number
    winnerId?: number
}

export type TCell = {
    coordinates: {
        x: number
        y: number
    }
    isRevealed: boolean
    isShip: boolean
}

export type GameList = {
    games: Game[]
    nextPageToken: number
    gameCount: number
}
