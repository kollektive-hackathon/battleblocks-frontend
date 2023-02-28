export const GameStatusEnum = {
    Created: 'CREATED',
    Preparing: 'PREPARING',
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

export type Coordinates = {
    x: number
    y: number
}

export type TCell = {
    coordinates: Coordinates
    isRevealed: boolean
    isShip: boolean
}

export type PlacementItem = Coordinates & {
    blockId: number
}

export type GameList = {
    games: Game[]
    nextPageToken: number
    gameCount: number
}
