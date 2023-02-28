import { useCallback, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'

import Block from '@/components/Block.comp'
import Cell from '@/components/Cell.comp'
import DraggableComponent from '@/components/dragAndDrop/Draggable.comp'
import DropTarget from '@/components/dragAndDrop/DropTarget.comp'
import { useNotificationContext } from '@/context/NotificationContext'
import { useUserContext } from '@/context/UserContext'
import { PlacementItem, TCell } from '@/types/game'
import { EMPTY_BOARD } from '@/utils/game'

export default function NewGame() {
    const [game] = useState<TCell[][]>(EMPTY_BOARD)
    const [placements, setPlacements] = useState<PlacementItem[]>([])

    const { state } = useLocation()
    const { user } = useUserContext()
    const { setNotification } = useNotificationContext()
    const navigate = useNavigate()

    const createMatch = useCallback(() => {
        axios.post('/game', { stake: state.stake, placements }).catch(() =>
            setNotification({
                title: 'placement-error',
                description: 'make sure you place ships containing at least 10 blocks'
            })
        )
    }, [state.stake, placements])

    const addPlacement = useCallback((x: number, y: number, blockId: number) => {
        setPlacements((prevState) => [...prevState, { x, y, blockId }])
    }, [])

    // if user lands on this page, stake isn't set
    if (!state?.stake) {
        navigate('/')

        setNotification({
            title: 'stake-error',
            description: 'stake must be set'
        })

        return <></>
    }

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
                                <DropTarget
                                    key={`${boardCell.coordinates.x}${boardCell.coordinates.y}`}
                                    onDrop={addPlacement}
                                    x={boardCell.coordinates.x}
                                    y={boardCell.coordinates.y}
                                >
                                    <Cell
                                        isRevealedDefault={boardCell.isRevealed}
                                        isShipDefault={boardCell.isShip}
                                        myBoard
                                    />
                                </DropTarget>
                            ))}
                        </div>
                    ))}
                    <div className="game-board__placement">
                        <div className="game-board__placement__title">pick&&place?10-blocks</div>
                        <div className="game-board__placement__inventory">
                            {user?.inventoryBlocks.map((block) => (
                                <DraggableComponent key={block.id} blockId={block.id}>
                                    <Block block={block} />
                                </DraggableComponent>
                            ))}
                        </div>
                        <div className="game-board__placement__submit" onClick={() => createMatch()}>
                            confirm block placement &gt;&gt;
                        </div>
                    </div>
                </div>
                <div className="delimiter" />
                <div className="game-board">waiting for opponent...</div>
            </div>
        </div>
    )
}
