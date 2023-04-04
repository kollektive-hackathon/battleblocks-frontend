import { useCallback } from 'react'

import Cell from '@/components/Cell.comp'
import { useUserContext } from '@/context/UserContext'
import { useIsMobile } from '@/hooks/isMobile.hook'
import { BlockPlacement, HitsPlacement, TGame } from '@/types/game'
import { EMPTY_BOARD, GAME_BOARD_MESSAGES, MY_BOARD_FIELD, OPPONENT_BOARD_FIELD } from '@/utils/game'

type Props = {
    hits: HitsPlacement
    gameInfo: TGame
    isMyTurn: boolean
    blockPlacements: BlockPlacement
    toggleGrid: () => void
    attackedBlock?: string
    // if it's my board, attack is undefined
    attack?: (x: number, y: number) => void
}

export default function GameBoard({
    hits,
    blockPlacements,
    attackedBlock,
    gameInfo,
    attack,
    isMyTurn,
    toggleGrid
}: Props) {
    const { user } = useUserContext()
    const { isMobile } = useIsMobile()

    const getBoardMessage = useCallback(() => {
        if (!gameInfo.gameStatus) {
            return ''
        }

        const MESSAGES = GAME_BOARD_MESSAGES[gameInfo.gameStatus][!attack ? MY_BOARD_FIELD : OPPONENT_BOARD_FIELD]

        switch (gameInfo.gameStatus) {
            case 'CREATED':

            case 'PREPARING':
                return MESSAGES[`${gameInfo.ownerId === user?.id}`]

            case 'PLAYING':
                return MESSAGES[`${isMyTurn}`]

            case 'FINISHED':
                return MESSAGES[`${gameInfo.winnerId === user?.id}`]

            default:
                return ''
        }
    }, [user, gameInfo.gameStatus, gameInfo.ownerId, gameInfo.winnerId])

    return (
        <div className="game-board">
            {EMPTY_BOARD.map((boardRow) => (
                <div key={boardRow[0].y} className="game-board__row">
                    {boardRow.map((boardCell) =>
                        attack ? (
                            <Cell
                                key={`${boardCell.x}${boardCell.y}`}
                                onClick={() => attack(boardCell.x, boardCell.y)}
                                isHit={hits[`${boardCell.x}${boardCell.y}`]}
                                isAttacked={attackedBlock === `${boardCell.x}${boardCell.y}`}
                                disabled={!!attackedBlock || !isMyTurn}
                            />
                        ) : (
                            <Cell
                                key={`${boardCell.x}${boardCell.y}`}
                                colorHex={blockPlacements[`${boardCell.x}${boardCell.y}`].color}
                                pattern={blockPlacements[`${boardCell.x}${boardCell.y}`].pattern}
                                isHit={hits[`${boardCell.x}${boardCell.y}`]}
                            />
                        )
                    )}
                </div>
            ))}

            <div className="game-board__container">
                <div className="game-board__message">{getBoardMessage()}</div>
                {isMobile && (
                    <div className="game-board__toggle-grid-cta" onClick={toggleGrid}>
                        <img src="/icons/switch.svg" alt="Flip board" width={35} />
                    </div>
                )}
            </div>
        </div>
    )
}
