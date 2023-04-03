export const GameStatusEnum = {
    Created: 'CREATED',
    Preparing: 'PREPARING',
    Playing: 'PLAYING',
    Finished: 'FINISHED'
} as const

export type GameStatus = (typeof GameStatusEnum)[keyof typeof GameStatusEnum]

export const GameSocketMessageEnum = {
    GameCreated: 'GAME_CREATED',
    MoveDone: 'MOVE_DONE',
    ChallengerJoined: 'CHALLENGER_JOINED',
    GameOver: 'GAME_OVER'
}

export type GameSocketMessage = (typeof GameSocketMessageEnum)[keyof typeof GameSocketMessageEnum]

export type TGame = {
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
    turn?: number
}

export type Coordinates = {
    x: number
    y: number
}

export type PlacementItem = Coordinates & {
    blockId: number
}

export type BlockPlacement = { [coordinates: string]: { color: string; pattern: string } }
export type HitsPlacement = { [coordinates: string]: boolean | null }

export type GameList = {
    games: TGame[]
    nextPageToken: number
    gameCount: number
}
