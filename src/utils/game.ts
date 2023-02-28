import { Coordinates, TCell } from '@/types/game'

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

export { EMPTY_BOARD, getShipCoordinates, PAGE_SIZE }
