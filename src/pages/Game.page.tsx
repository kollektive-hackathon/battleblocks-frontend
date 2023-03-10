import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'

import Cell from '@/components/Cell.comp'
import { useNotificationContext } from '@/context/NotificationContext'
import { useUserContext } from '@/context/UserContext'
import { Coordinates, GameSocketMessage, GameSocketMessageEnum, GameStatusEnum, TGame } from '@/types/game'
import {
    BLOCK_PLACEMENT_DEFAULT,
    CHALLENGER_TURN,
    EMPTY_BOARD,
    getShipCoordinates,
    HIT_PLACEMENT_DEFAULT,
    OWNER_TURN
} from '@/utils/game'

export default function Game() {
    const [socket, setSocket] = useState<WebSocket>()
    const gameRef = useRef<TGame>(null)
    const hitsRef = useRef<{ [coordinates: string]: boolean | null }>(null)
    const opponentHitsRef = useRef<{ [coordinates: string]: boolean | null }>(null)
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

    // hacks because these objects haven't updated in handleSocketMessage
    // TODO: check if these refs need to be updated like this or just once in (initial) useEffect
    useEffect(() => {
        // @ts-ignore
        gameRef.current = gameInfo
    }, [gameInfo])

    useEffect(() => {
        // @ts-ignore
        hitsRef.current = hits
    }, [hits])

    useEffect(() => {
        // @ts-ignore
        opponentHitsRef.current = opponentHits
    }, [opponentHits])

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
            .then((result) => {
                result.data.forEach((item: { userId: number; x: number; y: number; isHit: boolean }) => {
                    const { userId, isHit, x, y } = item
                    if (userId === user?.id) {
                        setHits((prevState) => ({
                            ...prevState,
                            [`${x}${y}`]: isHit
                        }))
                    } else {
                        setOpponentHits((prevState) => ({
                            ...prevState,
                            [`${x}${y}`]: isHit
                        }))
                    }
                })
            })
            .catch(() =>
                setNotification({ title: 'history-error', description: 'error fetching played moves, please refresh' })
            )
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
                    setGameInfo((prevState) => ({
                        ...prevState!,
                        gameStatus: GameStatusEnum.Created
                    }))

                    break

                case GameSocketMessageEnum.ChallengerJoined:
                    setGameInfo((prevState) => ({
                        ...prevState!,
                        gameStatus: GameStatusEnum.Playing,
                        turn: payload.turn,
                        challengerUsername: payload.challengerName
                    }))

                    if (payload.challengerName !== user?.username) {
                        setNotification({
                            title: 'time-for-battle',
                            description: `${payload.challengerName} joined your game`
                        })
                    }

                    break

                case GameSocketMessageEnum.MoveDone: {
                    setGameInfo((prevState) => ({
                        ...prevState!,
                        turn: payload.turn
                    }))

                    setAttackedBlock('')

                    const isMine = payload.userId === user?.id

                    if (isMine) {
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

                    setNotification({
                        title: `${isMine ? 'your' : "opponent's"}-attack-${payload.isHit ? 'hit' : 'miss'}`,
                        description: `${!isMine ? 'you have' : `${gameRef.current?.challengerUsername} has`} ${
                            10 -
                            (payload.isHit ? 1 : 0) -
                            Object.values((isMine ? hitsRef.current : opponentHitsRef.current) ?? {}).filter(
                                (value) => value
                            ).length
                        } lives left`
                    })

                    break
                }

                case GameSocketMessageEnum.GameOver: {
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
        [setGameInfo, user?.id, setNotification, socket, setAttackedBlock, setHits, setOpponentHits]
    )

    const attack = useCallback((x: number, y: number) => {
        setAttackedBlock(`${x}${y}`)

        axios.post(`/game/${id}/moves`, { x, y }).catch(() => {
            setAttackedBlock('')

            setNotification({ title: 'attack-error', description: 'something went wrong, please try again' })
        })
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
                        <div className="game-board__message">
                            {gameInfo.ownerId === user?.id ? 'waiting for' : 'waiting...'}
                        </div>
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
                        <div className="game-board__message">{isMyTurn ? 'press-to-attack ???' : 'waiting...'}</div>
                    ) : (
                        gameInfo?.gameStatus === GameStatusEnum.Finished && (
                            <div className="game-board__message">
                                {gameInfo.winnerId === user?.id ? 'loser' : 'winner'}
                            </div>
                        )
                    )}
                    {(gameInfo?.gameStatus === GameStatusEnum.Created ||
                        gameInfo?.gameStatus === GameStatusEnum.Preparing) && (
                        <div className="game-board__message">
                            {gameInfo.ownerId === user?.id ? 'someone to join' : 'waiting...'}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
