import { useState } from 'react'

import Block from '@/components/Block.comp'
import Cell from '@/components/Cell.comp'
import { useUserContext } from '@/context/UserContext'
import { TCell } from '@/types/game'
import { EMPTY_BOARD } from '@/utils/game'

export default function NewGame() {
    const [game] = useState<TCell[][]>(EMPTY_BOARD)
    const { user } = useUserContext()

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
                    <div className="game-board__placement">
                        <div className="game-board__placement__title">pick&&place?10-blocks</div>
                        <div className="game-board__placement__inventory">
                            {user?.inventoryBlocks.map((block) => (
                                <Block key={block.id} block={block} />
                            ))}
                        </div>
                        <div className="game-board__placement__submit">confirm block placement &gt;&gt;</div>
                    </div>
                </div>
                <div className="delimiter" />
                <div className="game-board">waiting for opponent...</div>
            </div>
        </div>
    )
}
