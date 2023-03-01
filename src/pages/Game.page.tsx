import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'

import Cell from '@/components/Cell.comp'
import { useNotificationContext } from '@/context/NotificationContext'
import { useUserContext } from '@/context/UserContext'
import { Coordinates, GameSocketMessage, GameSocketMessageEnum, GameStatusEnum, TGame } from '@/types/game'
import { BLOCK_PLACEMENT_DEFAULT, EMPTY_BOARD, getShipCoordinates, HIT_PLACEMENT_DEFAULT } from '@/utils/game'

const OWNER_TURN = 1
const CHALLENGER_TURN = 2

export default function Game() {
    const [socket, setSocket] = useState<WebSocket>()
    const [gameInfo, setGameInfo] = useState<TGame>()
    const [blockPlacements, setBlockPlacements] = useState(BLOCK_PLACEMENT_DEFAULT)
    const [hits, setHits] = useState(HIT_PLACEMENT_DEFAULT)
    const [opponentHits, setOpponentHits] = useState(HIT_PLACEMENT_DEFAULT)
    const [attackedBlock, setAttackedBlock] = useState('')

    const { id } = useParams<{ id: string }>()
    const { setNotification } = useNotificationContext()
    const { user } = useUserContext()
    const navigate = useNavigate()

    useEffect(() => {
        fetchGame()
            .then(() => fetchPlacement())
            .then(() => fetchMoves())
            .then(() => openSocket())

        return () => {
            if (socket) {
                socket.close()
            }
        }
    }, [])

    const fetchGame = useCallback(async () => {
        return axios
            .get(`/game/${id}`)
            .then((result) => {
                setGameInfo(result.data)

                const { ownerId, challengerId } = result.data

                if (ownerId && challengerId && ![ownerId, challengerId].includes(user?.id)) {
                    navigate('/')
                }
            })
            .catch(() => setNotification({ title: 'game-error', description: 'error fetching game' }))
    }, [setGameInfo, setNotification])

    const fetchPlacement = useCallback(() => {
        return axios
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
    }, [setBlockPlacements, setNotification])

    const fetchMoves = useCallback(() => {
        axios
            .get(`/game/${id}/moves`)
            .then((result) => console.log(result.data))
            .catch(() => setNotification({ title: 'history-error', description: 'error fetching move history' }))
    }, [setNotification])

    const openSocket = useCallback(() => {
        const sock = new WebSocket(`wss://battleblocks.lol/api/ws/game/${id}`)

        setSocket(sock)

        sock.onmessage = (e) => {
            const { payload, type } = JSON.parse(e.data)

            handleSocketMessage(type, payload)
        }
    }, [setSocket])

    const handleSocketMessage = useCallback(
        (type: GameSocketMessage, payload: any) => {
            switch (type) {
                case GameSocketMessageEnum.GameCreated:
                    console.log('created', payload)

                    setGameInfo((prevState) => ({
                        ...prevState!,
                        gameStatus: GameStatusEnum.Created
                    }))

                    break

                case GameSocketMessageEnum.ChallengerJoined:
                    console.log('joined', payload)

                    setGameInfo((prevState) => ({
                        ...prevState!,
                        gameStatus: GameStatusEnum.Playing,
                        turn: payload.turn,
                        challengerUsername: payload.challengerName
                    }))

                    setNotification({
                        title: 'time-for-battle',
                        description: `${payload.challengerName} joined your game`
                    })

                    break

                case GameSocketMessageEnum.MoveDone:
                    console.log('move', payload)

                    setGameInfo((prevState) => ({
                        ...prevState!,
                        turn: payload.turn
                    }))

                    setAttackedBlock('')

                    if (payload.userId === user?.id) {
                        setHits((prevState) => ({
                            ...prevState,
                            [`${payload.x}${payload.y}`]: payload.isHit
                        }))
                    } else {
                        setOpponentHits((prevState) => ({
                            ...prevState,
                            [`${payload.x}${payload.y}`]: payload.isHit
                        }))
                    }

                    break

                case GameSocketMessageEnum.GameOver: {
                    console.log('game over', payload)

                    const winnerId = +payload.winnerId

                    setGameInfo((prevState) => ({
                        ...prevState!,
                        gameStatus: GameStatusEnum.Finished,
                        winnerId
                    }))

                    setNotification({
                        title: 'game-over',
                        description: user?.id === winnerId ? 'congratulations, you won!' : 'better luck next time!'
                    })

                    socket?.close()

                    break
                }

                default:
                    throw Error('Unsupported websocket message type')
            }
        },
        [setGameInfo, user?.id, setNotification, socket]
    )

    const attack = useCallback((x: number, y: number) => {
        axios
            .post(`/game/${id}/moves`, { x, y })
            .then(() => {
                setAttackedBlock(`${x}${y}`)
            })
            .catch(() =>
                setNotification({ title: 'attack-error', description: 'something went wrong, please try again' })
            )
    }, [])

    const isMyTurn = useMemo(() => {
        return (
            (gameInfo?.ownerId === user?.id && gameInfo?.turn === OWNER_TURN) ||
            (gameInfo?.challengerId === user?.id && gameInfo?.turn === CHALLENGER_TURN)
        )
    }, [gameInfo?.turn, user?.id, gameInfo?.ownerId])

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
                    {EMPTY_BOARD.map((boardRow) => (
                        <div key={boardRow[0].y} className="game-board__row">
                            {boardRow.map((boardCell) => (
                                <Cell
                                    key={`${boardCell.x}${boardCell.y}`}
                                    colorHex={blockPlacements[`${boardCell.x}${boardCell.y}`]}
                                    isHit={opponentHits[`${boardCell.x}${boardCell.y}`]}
                                />
                            ))}
                        </div>
                    ))}
                    {gameInfo?.gameStatus === GameStatusEnum.Playing ? (
                        <div className="game-board__message">{isMyTurn ? 'your?turn' : 'opponent?turn'} &gt;&gt;</div>
                    ) : (
                        gameInfo?.gameStatus === GameStatusEnum.Finished && (
                            <div className="game-board__message">
                                {gameInfo.winnerId === user?.id ? 'winner' : 'loser'}
                            </div>
                        )
                    )}
                    {(gameInfo?.gameStatus === GameStatusEnum.Created ||
                        gameInfo?.gameStatus === GameStatusEnum.Preparing) && (
                        <div className="game-board__message">waiting for</div>
                    )}
                </div>
                <div className="delimiter" />
                <div className="game-board">
                    {EMPTY_BOARD.map((boardRow) => (
                        <div key={boardRow[0].y} className="game-board__row">
                            {boardRow.map((boardCell) => (
                                <Cell
                                    key={`${boardCell.x}${boardCell.y}`}
                                    onClick={() => attack(boardCell.x, boardCell.y)}
                                    isHit={hits[`${boardCell.x}${boardCell.y}`]}
                                    isAttacked={attackedBlock === `${boardCell.x}${boardCell.y}`}
                                    disabled={!!attackedBlock || !isMyTurn}
                                />
                            ))}
                        </div>
                    ))}
                    {gameInfo?.gameStatus === GameStatusEnum.Playing ? (
                        <div className="game-board__message">{isMyTurn ? 'press-to-attack ↑' : 'waiting...'}</div>
                    ) : (
                        gameInfo?.gameStatus === GameStatusEnum.Finished && (
                            <div className="game-board__message">
                                {gameInfo.winnerId === user?.id ? 'loser' : 'winner'}
                            </div>
                        )
                    )}
                    {(gameInfo?.gameStatus === GameStatusEnum.Created ||
                        gameInfo?.gameStatus === GameStatusEnum.Preparing) && (
                        <div className="game-board__message">someone to join</div>
                    )}
                </div>
            </div>
        </div>
    )
}
