import { BlockPlacement, Coordinates, GameStatusEnum, HitsPlacement } from '@/types/game'

const OWNER_TURN = 1
const CHALLENGER_TURN = 2
const EMPTY_BOARD: Coordinates[][] = []
const PAGE_SIZE = 8
const BLOCK_PLACEMENT_DEFAULT: BlockPlacement = {}

const HIT_PLACEMENT_DEFAULT: HitsPlacement = {}

const GAME_BOARD_MESSAGES = {
    [GameStatusEnum.Playing]: {
        myBoard: {
            true: 'your?turn',
            false: 'opponent?turn'
        },
        opponentBoard: {
            true: 'press-to-attack ↑',
            false: 'waiting...'
        }
    },
    [GameStatusEnum.Finished]: {
        myBoard: {
            true: 'winner',
            false: 'loser'
        },
        opponentBoard: {
            true: 'winner',
            false: 'loser'
        }
    },
    [GameStatusEnum.Created]: {
        myBoard: {
            true: 'waiting for',
            false: 'waiting...'
        },
        opponentBoard: {
            true: 'someone to join',
            false: 'waiting...'
        }
    },
    [GameStatusEnum.Preparing]: {
        myBoard: {
            true: 'waiting for',
            false: 'waiting...'
        },
        opponentBoard: {
            true: 'someone to join',
            false: 'waiting...'
        }
    }
} as const

for (let y = 0; y < 10; y += 1) {
    EMPTY_BOARD.push([])

    for (let x = 0; x < 10; x += 1) {
        EMPTY_BOARD[y].push({
            x,
            y
        })
    }
}

for (let x = 0; x <= 9; x += 1) {
    for (let y = 0; y <= 9; y += 1) {
        const key = `${x}${y}`
        BLOCK_PLACEMENT_DEFAULT[key] = { color: '#e5e5e5', pattern: 'basic' }

        HIT_PLACEMENT_DEFAULT[key] = null
    }
}

function getStringInBetween(str: string, start: string, end: string): string {
    const startIndex = str.indexOf(start)
    if (startIndex === -1) {
        return ''
    }

    let endIndex = str.indexOf(end, startIndex + start.length)
    if (endIndex === -1) {
        endIndex = str.length
    }

    return str.slice(startIndex + start.length, endIndex)
}

function getShipCoordinates(blockType: string, placement: Coordinates): Coordinates[] {
    const li: Coordinates[] = []

    const firstRow = getStringInBetween(blockType, 'a', 'b')
    const secondRow = getStringInBetween(blockType, 'b', 'c')

    // eslint-disable-next-line no-restricted-syntax
    for (const single of firstRow) {
        const singleNr = +single

        const node = {
            x: placement.x + singleNr - 1,
            y: placement.y
        }

        li.push(node)
    }

    // eslint-disable-next-line no-restricted-syntax
    for (const single of secondRow) {
        const singleNr = +single

        const node = {
            x: placement.x + singleNr - 1,
            y: placement.y + 1
        }

        li.push(node)
    }

    return li
}

export {
    BLOCK_PLACEMENT_DEFAULT,
    CHALLENGER_TURN,
    EMPTY_BOARD,
    GAME_BOARD_MESSAGES,
    getShipCoordinates,
    HIT_PLACEMENT_DEFAULT,
    OWNER_TURN,
    PAGE_SIZE
}
