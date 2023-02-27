import { TCell } from '@/types/game'

const EMPTY_BOARD: TCell[][] = []
const PAGE_SIZE = 8

for (let x = 0; x < 10; x += 1) {
    EMPTY_BOARD.push([])

    for (let y = 0; y < 10; y += 1) {
        EMPTY_BOARD[x].push({
            coordinates: {
                x,
                y
            },
            isRevealed: false,
            isShip: false
        })
    }
}

export { EMPTY_BOARD, PAGE_SIZE }
