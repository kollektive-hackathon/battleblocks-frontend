import { useState } from 'react'

import Cell from '@/components/Cell.comp'
import { TCell } from '@/types/game'
import { EMPTY_BOARD } from '@/utils/game'

export default function NewGame() {
    const [game] = useState<TCell[][]>(EMPTY_BOARD)

    return (
        <div className="new-game page-container">
            <div className="page-container__title">
                <div className="page-container__title__value">you vs ???</div>
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
                                    myBoard
                                />
                            ))}
                        </div>
                    ))}
                </div>
                <div className="delimiter" />
                <div className="game-board">waiting for opponent...</div>
            </div>
        </div>
    )
}
