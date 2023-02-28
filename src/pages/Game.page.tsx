import { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'

import Cell from '@/components/Cell.comp'
import { useNotificationContext } from '@/context/NotificationContext'
import { useUserContext } from '@/context/UserContext'
// eslint-disable-next-line no-unused-vars
import type { Coordinates, Game, TCell } from '@/types/game'
import { BLOCK_PLACEMENT_DEFAULT, EMPTY_BOARD, getShipCoordinates } from '@/utils/game'

// eslint-disable-next-line no-redeclare
export default function Game() {
    const [game] = useState<TCell[][]>(EMPTY_BOARD)
    const [socket, setSocket] = useState<WebSocket>()
    const [gameInfo, setGameInfo] = useState<Game>()
    const [blockPlacements, setBlockPlacements] = useState<{ [coordinates: string]: string }>(BLOCK_PLACEMENT_DEFAULT)

    const { id } = useParams<{ id: string }>()
    const { setNotification } = useNotificationContext()
    const { user } = useUserContext()

    useEffect(() => {
        const fetchGame = async () => {
            axios
                .get(`/game/${id}`)
                .then((result) => setGameInfo(result.data))
                .catch(() => setNotification({ title: 'game-error', description: 'error fetching game' }))
        }

        fetchGame()
            .then(() => openSocket())
            .then(() => fetchPlacement())

        return () => {
            if (socket) {
                socket.close()
            }
        }
    }, [])

    const openSocket = useCallback(() => {
        const sock = new WebSocket(`wss://battleblocks.lol/api/ws/game/${id}`)

        setSocket(sock)

        sock.onmessage = (e) => {
            const { payload, type } = JSON.parse(e.data)
        }
    }, [setSocket])

    const fetchPlacement = useCallback(() => {
        axios
            .get(`/game/${id}/placement`)
            .then((result) => {
                result.data.forEach((placement: Coordinates & { colorHex: string; blockType: string }) => {
                    const shipCoordinates = getShipCoordinates(placement.blockType, {
                        x: +placement.x,
                        y: +placement.y
                    })

                    // eslint-disable-next-line no-restricted-syntax
                    for (const { x: xs, y: ys } of shipCoordinates) {
                        setBlockPlacements((prevState) => ({
                            ...prevState,
                            [`${xs}${ys}`]: placement.colorHex
                        }))
                    }
                })
            })
            .catch(() =>
                setNotification({ title: 'fetch-error', description: 'error fetching your placement, please refresh' })
            )
    }, [setBlockPlacements])

    return (
        <div className="game page-container">
            <div className="page-container__title">
                <div className="page-container__title__value">
                    you vs{' '}
                    {(gameInfo?.ownerId === user?.id ? gameInfo?.challengerUsername : gameInfo?.ownerUsername) ?? '???'}
                </div>
                <div className="game-stake">
                    <div className="game-stake__title">stake?amount&gt;</div>
                    <div className="game-stake__value">{gameInfo?.stake} flow</div>
                </div>
            </div>
            <div className="page-container__content">
                <div className="game-board">
                    {game.map((boardRow) => (
                        <div key={boardRow[0].coordinates.y} className="game-board__row">
                            {boardRow.map((boardCell) => (
                                <Cell
                                    key={`${boardCell.coordinates.x}${boardCell.coordinates.y}`}
                                    isRevealedDefault={boardCell.isRevealed}
                                    isShipDefault={boardCell.isShip}
                                    myBoard
                                    colorHex={blockPlacements[`${boardCell.coordinates.x}${boardCell.coordinates.y}`]}
                                />
                            ))}
                        </div>
                    ))}
                </div>
                <div className="delimiter" />
                <div className="game-board">
                    {game.map((boardRow) => (
                        <div key={boardRow[0].coordinates.y} className="game-board__row">
                            {boardRow.map((boardCell) => (
                                <Cell
                                    key={`${boardCell.coordinates.x}${boardCell.coordinates.y}`}
                                    isRevealedDefault={boardCell.isRevealed}
                                    isShipDefault={boardCell.isShip}
                                    myBoard={false}
                                />
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
