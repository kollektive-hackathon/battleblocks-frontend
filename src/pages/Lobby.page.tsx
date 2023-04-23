import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { DateTime } from 'luxon'

import CreateMatchModal from '@/components/CreateMatchModal.comp'
import Loader from '@/components/Loader.comp'
import { useNotificationContext } from '@/context/NotificationContext'
import { User, useUserContext } from '@/context/UserContext'
import { useIsMobile } from '@/hooks/isMobile.hook'
import { GameList, TGame } from '@/types/game'
import { CHALLENGER_TURN, OWNER_TURN, PAGE_SIZE } from '@/utils/game'

const getGameRoute = (game: TGame, user: User) =>
    `/game/${game.id}${!game.challengerId && game.ownerId !== user?.id ? '/join' : ''}`

const getNewGameConfig = (game: TGame) => ({
    state: {
        stake: game.stake,
        owner: game.ownerUsername,
        id: game.id
    }
})

export default function Lobby() {
    const [gamesList, setGamesList] = useState<GameList>()
    const [showCreateModal, setShowCreateModal] = useState(false)

    const { user } = useUserContext()
    const { setNotification } = useNotificationContext()
    const navigate = useNavigate()
    const { isMobile } = useIsMobile()

    useEffect(() => {
        fetchGames()
    }, [])

    const fetchGames = useCallback(() => {
        axios
            .get(`/game?page_size=${PAGE_SIZE}&page_token=${gamesList?.nextPageToken ?? 0}`)
            .then((result) => {
                const { items: games, nextPageToken, itemCount: gameCount } = result.data

                setGamesList((prevState) => ({
                    games: prevState?.games ? [...prevState.games, ...games] : games,
                    nextPageToken,
                    gameCount
                }))
            })
            .catch(() => {
                setNotification({
                    title: 'lobby-error',
                    description: 'something went wrong when fetching games'
                })
            })
    }, [gamesList, setGamesList, setNotification])

    return (
        <div className="lobby page-container">
            <div className="page-container__title">
                <div className="page-container__title__value">play //</div>
                <div className="create-match" onClick={() => setShowCreateModal(true)}>
                    create match &gt;&gt;
                </div>{' '}
            </div>
            <div className="page-container__content page-container__content--scrollable">
                <table className="page-container__content__table">
                    <thead>
                        <tr>
                            <th>active lobbies ({gamesList?.gameCount ?? 0})</th>
                            {!isMobile && (
                                <>
                                    <th>players</th>
                                    <th>time created</th>
                                </>
                            )}
                            <th>stake</th>
                        </tr>
                    </thead>
                    <tbody>
                        {gamesList?.games ? (
                            <>
                                {gamesList.games.map((game) => (
                                    <tr
                                        key={game.id}
                                        className={`table-item${
                                            (game.ownerId === user?.id && game.turn === CHALLENGER_TURN) ||
                                            (game.challengerId === user?.id && game.turn === OWNER_TURN)
                                                ? ' table-item--deactivated'
                                                : ''
                                        }`}
                                        onClick={
                                            () => navigate(getGameRoute(game, user!), getNewGameConfig(game))
                                            // eslint-disable-next-line
                                        }
                                    >
                                        {!isMobile && (
                                            <td className="table-item__property">
                                                {game.challengerId
                                                    ? 'battling //'
                                                    : game.ownerId === user?.id
                                                    ? 'waiting //'
                                                    : 'join >>'}
                                            </td>
                                        )}
                                        <td className="table-item__property">
                                            {game.ownerId === user?.id ? 'you' : game.ownerUsername} vs{' '}
                                            {(game.challengerId === user?.id ? 'you' : game.challengerUsername) ??
                                                '???'}
                                        </td>
                                        {!isMobile && (
                                            <td className="table-item__property">
                                                {DateTime.fromMillis(game.timeCreated).toFormat('HH:mm dd/LL/yyyy')}
                                            </td>
                                        )}
                                        <td className="table-item__property">{game.stake} flow</td>
                                    </tr>
                                ))}
                                {gamesList?.nextPageToken && (
                                    <tr className="load-more__row">
                                        <td colSpan={isMobile ? 2 : 4} className="load-more__cell">
                                            <div className="load-more" onClick={() => fetchGames()}>
                                                load more
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </>
                        ) : (
                            <tr>
                                <td style={{ backgroundColor: 'black' }}>
                                    <Loader />
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            {showCreateModal && <CreateMatchModal closeModal={() => setShowCreateModal(false)} />}
        </div>
    )
}
