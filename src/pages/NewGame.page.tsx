import { useState } from 'react'

import Cell from '@/components/Cell.comp'
import { TCell } from '@/types/game'

const emptyBoard: TCell[][] = []

for (let x = 0; x < 10; x += 1) {
    emptyBoard.push([])

    for (let y = 0; y < 10; y += 1) {
        emptyBoard[x].push({
            coordinates: {
                x,
                y
            },
            isRevealed: false,
            isShip: false
        })
    }
}

export default function NewGame() {
    const [game] = useState<TCell[][]>(emptyBoard)

    return (
        <div className="new-game page-container">
            <div className="page-container__title">
                <div className="page-container__title__value">you vs ???</div>
                <div className="new-game-stake">
                    <div className="new-game-stake__title">prize?amount&gt;</div>
                    <div className="new-game-stake__value">$69</div>
                </div>
            </div>
            <div className="page-container__content">
                <div className="game-board">
                    {game.map((boardRow) => (
                        <div key={boardRow[0].coordinates.x} className="game-board__row">
                            {boardRow.map((boardCell) => (
                                <Cell
                                    key={`${boardCell.coordinates.x}${boardCell.coordinates.y}`}
                                    isRevealedDefault={boardCell.isRevealed}
                                    isShipDefault={boardCell.isShip}
                                />
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
