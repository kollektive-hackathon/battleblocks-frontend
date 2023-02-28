import { useCallback, useEffect, useState } from 'react'
import axios from 'axios'

import Loader from '@/components/Loader.comp'
import { useNotificationContext } from '@/context/NotificationContext'
import { useUserContext } from '@/context/UserContext'
import { cosign } from '@/flow/cosign.tx'
import { removeTokenAndUser } from '@/utils/token'

export default function Profile() {
    const { bloctoUser, setUser, user } = useUserContext()
    const { setNotification } = useNotificationContext()
    const [custodialWallet, setCustodialWallet] = useState<string>('')
    const [connectWalletMessage, setConnectWalletMessage] = useState('personal-wallet?connect >>')

    const logout = useCallback(() => {
        setUser(null)

        removeTokenAndUser()
    }, [])

    const copyToClipboard = useCallback(
        (address: string) => {
            navigator.clipboard.writeText(address).then(() => {
                setNotification({
                    title: 'wallet-address',
                    description: 'successfully copied to clipboard'
                })
            })
        },
        [setNotification]
    )

    const sendCosignTx = useCallback(async () => {
        if (connectWalletMessage !== 'Connecting...') {
            await setConnectWalletMessage('Connecting...')

            await cosign(user?.custodialWalletAddress!)

            setCustodialWallet(bloctoUser?.addr!)
        }
    }, [connectWalletMessage, user?.custodialWalletAddress, bloctoUser?.addr])

    useEffect(() => {
        axios
            .get('/profile')
            .then((result) => setUser(result.data))
            .catch(() =>
                setNotification({
                    title: 'profile-error',
                    description: 'error fetching profile'
                })
            )
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
                        <span
                            className="wallet-container__address"
                            onClick={() => copyToClipboard(user.custodialWalletAddress)}
                        >
                            {user.custodialWalletAddress}
                        </span>
                    </div>
                    {user.selfCustodyWalletAddress || custodialWallet ? (
                        <div className="profile__wallet-container__connected">
                            personal-wallet:{' '}
                            <span
                                className="wallet-container__address"
                                onClick={
                                    () =>
                                        (user.selfCustodyWalletAddress || custodialWallet) &&
                                        copyToClipboard(user.selfCustodyWalletAddress || custodialWallet)
                                    // eslint-disable-next-line react/jsx-curly-newline
                                }
                            >
                                {user.selfCustodyWalletAddress || custodialWallet}
                            </span>
                        </div>
                    ) : (
                        <div className="profile__wallet-container__connect" onClick={() => sendCosignTx()}>
                            {connectWalletMessage}
                        </div>
                    )}
                </div>
                {!!user.inventoryBlocks && (
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
                )}
            </div>
        </div>
    ) : (
        <Loader />
    )
}
