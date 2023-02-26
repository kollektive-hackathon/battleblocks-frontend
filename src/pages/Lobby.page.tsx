import { useState } from 'react'
import { DateTime } from 'luxon'

import CreateMatchModal from '@/components/CreateMatchModal.comp'
import { useUserContext } from '@/context/UserContext'
import { Game } from '@/types/game'

export default function Lobby() {
    const { user } = useUserContext()
    const [games, setGames] = useState<Game[]>([
        {
            id: 0,
            ownerId: 420,
            ownerUsername: 'kojesrao',
            stake: 50,
            timeCreated: 1677437547000
        },
        {
            id: 1,
            ownerId: 69,
            ownerUsername: 'toma',
            stake: 33,
            timeCreated: 1677437547000
        },
        {
            id: 2,
            ownerId: 11,
            ownerUsername: 'lovro',
            stake: 51,
            timeCreated: 1677437547000
        },
        {
            id: 3,
            ownerId: 69,
            ownerUsername: 'toma',
            stake: 420,
            timeCreated: 1677437547000
        }
    ])

    const [showCreateModal, setShowCreateModal] = useState(false)

    return (
        <div className="lobby page-container">
            <div className="page-container__title">
                <div className="page-container__title__value">play //</div>
                <div className="create-match" onClick={() => setShowCreateModal(true)}>
                    create match &gt;&gt;
                </div>{' '}
            </div>
            <div className="page-container__content">
                <table className="page-container__content__table">
                    <thead>
                        <tr>
                            <th>active lobbies</th>
                            <th>players</th>
                            <th>time created</th>
                            <th>stake</th>
                        </tr>
                    </thead>
                    <tbody>
                        {games.map((game) => (
                            <tr key={game.id} className="table-item">
                                <td className="table-item__property">
                                    {game.challengerId
                                        ? 'battling //'
                                        : game.ownerId === user?.id
                                        ? 'waiting //'
                                        : 'join >>'}
                                </td>
                                <td className="table-item__property">
                                    {game.ownerId === user?.id ? 'you' : game.ownerUsername} vs{' '}
                                    {game.challengerUsername ?? '???'}
                                </td>
                                <td className="table-item__property">
                                    {DateTime.fromMillis(game.timeCreated).toFormat('HH:mm dd/LL/yyyy')}
                                </td>
                                <td className="table-item__property">${game.stake}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {showCreateModal && <CreateMatchModal closeModal={() => setShowCreateModal(false)} />}
        </div>
    )
}
