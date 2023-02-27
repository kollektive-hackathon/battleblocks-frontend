import { useCallback } from 'react'

import Loader from '@/components/Loader.comp'
import { useUserContext } from '@/context/UserContext'
import { cosign } from '@/flow/cosign.tx'
import { removeTokenAndUser } from '@/utils/login'

export default function Profile() {
    const { bloctoUser, setUser, user } = useUserContext()

    const logout = useCallback(() => {
        setUser(null)

        removeTokenAndUser()
    }, [])

    return user ? (
        <div className="profile page-container">
            <div className="page-container__title">
                <div className="page-container__title__value">profile // {user.username}</div>
                <div className="logout" onClick={() => logout()}>
                    logout //
                </div>
            </div>
            <div className="page-container__content">
                <div className="profile__wallet-container">
                    <div className="profile__wallet-container__battleblocks">
                        battleblocks-wallet:{' '}
                        <span className="wallet-container__address">{user.custodialWalletAddress}</span>
                    </div>
                    {user.selfCustodyWalletAddress || bloctoUser?.addr ? (
                        <div className="profile__wallet-container__connected">
                            personal-wallet:{' '}
                            <span className="wallet-container__address">
                                {user.selfCustodyWalletAddress ?? bloctoUser?.addr}
                            </span>
                        </div>
                    ) : (
                        <div className="profile__wallet-container__connect" onClick={() => cosign()}>
                            personal-wallet?connect &gt;&gt;
                        </div>
                    )}
                </div>
                <table className="page-container__content__table">
                    <thead>
                        <tr>
                            <th>my inventory</th>
                            <th>block type</th>
                            <th>rarity</th>
                            <th>active</th>
                        </tr>
                    </thead>
                    <tbody>
                        {user.inventoryBlocks.map((block) => (
                            <tr
                                key={block.id}
                                className={`table-item${!block.active ? ' table-item--deactivated' : ''}`}
                                onClick={() => {
                                    // TODO: toggle active
                                }}
                            >
                                <td className="table-item__property">{block.name}</td>
                                <td className="table-item__property">{block.type}</td>
                                <td className="table-item__property">{block.rarity}</td>
                                <td className="table-item__property">{block.active ? '+' : '-'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    ) : (
        <Loader />
    )
}
