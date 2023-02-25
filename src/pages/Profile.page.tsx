import { useState } from 'react'

import Loader from '@/components/Loader.comp'
import { UserProfile } from '@/types/profile'

export default function Profile() {
    const [userProfile, setUserProfile] = useState<UserProfile>({
        id: 420,
        username: 'kojesrao',
        email: 'filip.stokovic@gmail.com',
        custodialWalletAddress: '0x494d3d8ed363250b',
        inventoryBlocks: [
            {
                id: 0,
                name: 'red tube',
                type: '4x1',
                rarity: 'epic',
                active: true
            },
            {
                id: 1,
                name: 'blue ivy',
                type: '2x2',
                rarity: 'rare',
                active: false
            },
            {
                id: 2,
                name: 'red tube',
                type: '4x1',
                rarity: 'epic',
                active: true
            },
            {
                id: 3,
                name: 'blue ivy',
                type: '2x2',
                rarity: 'rare',
                active: true
            },
            {
                id: 4,
                name: 'blue ivy',
                type: '2x2',
                rarity: 'rare',
                active: false
            },
            {
                id: 5,
                name: 'red tube',
                type: '4x1',
                rarity: 'epic',
                active: true
            },
            {
                id: 6,
                name: 'blue ivy',
                type: '2x2',
                rarity: 'rare',
                active: true
            },
            {
                id: 7,
                name: 'blue ivy',
                type: '2x2',
                rarity: 'rare',
                active: false
            },
            {
                id: 8,
                name: 'red tube',
                type: '4x1',
                rarity: 'epic',
                active: true
            },
            {
                id: 9,
                name: 'blue ivy',
                type: '2x2',
                rarity: 'rare',
                active: true
            }
        ]
    })

    return (
        <div className="profile page-container">
            {userProfile ? (
                <>
                    <div className="page-container__title">profile // {userProfile.username}</div>
                    <div className="page-container__content">
                        <div className="profile__wallet-container">
                            <div className="profile__wallet-container__battleblocks">
                                battleblocks-wallet: {userProfile.custodialWalletAddress}
                            </div>
                            {userProfile.selfCustodyWalletAddress ? (
                                <div className="profile__wallet-container__custodial">
                                    wallet: {userProfile.selfCustodyWalletAddress}
                                </div>
                            ) : (
                                <div className="profile__wallet-container__connect">
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
                                {userProfile.inventoryBlocks.map((block) => (
                                    <tr
                                        key={block.id}
                                        className="table-item"
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
                </>
            ) : (
                <Loader />
            )}
        </div>
    )
}
