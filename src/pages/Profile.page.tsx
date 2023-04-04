import { useCallback, useEffect, useState } from 'react'
import axios from 'axios'

import Block from '@/components/Block.comp'
import Loader from '@/components/Loader.comp'
import { useNotificationContext } from '@/context/NotificationContext'
import { useUserContext } from '@/context/UserContext'
import { cosign } from '@/flow/cosign.tx'
import { useIsMobile } from '@/hooks/isMobile.hook'
import { removeToken } from '@/utils/token'

const copyToClipboardMobile = (text: string) => {
    const input = document.createElement('input')
    input.setAttribute('value', text)

    document.body.appendChild(input)

    input.select()

    document.execCommand('copy')

    document.body.removeChild(input)
}

export default function Profile() {
    const [custodialWallet, setCustodialWallet] = useState<string>('')
    const [connectWalletMessage, setConnectWalletMessage] = useState('personal-wallet?connect >>')

    const { bloctoUser, setUser, user } = useUserContext()
    const { setNotification } = useNotificationContext()
    const { isMobile } = useIsMobile()

    const logout = useCallback(() => {
        setUser(null)

        removeToken()
    }, [])

    const copyToClipboard = useCallback(
        (address: string) => {
            if (!isMobile) {
                navigator.clipboard.writeText(address).then(() => {
                    setNotification({
                        title: 'wallet-address',
                        description: 'successfully copied to clipboard'
                    })
                })
            } else {
                copyToClipboardMobile(address)

                setNotification({
                    title: 'wallet-address',
                    description: 'successfully copied to clipboard'
                })
            }
        },
        [setNotification]
    )

    const toggleActive = useCallback(
        (newBlockId: number) => {
            const activeBlocks = user?.inventoryBlocks.filter((block) => block.active).map((block) => block.id) ?? []

            const activeBlockIds = activeBlocks.includes(newBlockId)
                ? activeBlocks.filter((id) => id !== newBlockId)
                : [...activeBlocks, newBlockId]

            axios
                .put('/profile/blocks', { activeBlockIds })
                .then((result) => setUser(result.data))
                .catch(() =>
                    setNotification({
                        title: 'toggle-error',
                        description: 'error toggling item in inventory'
                    })
                )
        },
        [user]
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
            <div className="page-container__content page-container__content--scrollable">
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
                                {!isMobile && <th>rarity</th>}
                                <th>active</th>
                            </tr>
                        </thead>
                        <tbody>
                            {user.inventoryBlocks.map((block) => (
                                <tr
                                    key={block.id}
                                    className={`table-item${!block.active ? ' table-item--deactivated' : ''}`}
                                    onClick={() => toggleActive(block.id)}
                                >
                                    <td className="table-item__property">{block.name}</td>
                                    <td className="table-item__property">
                                        <Block block={block} isSmall />
                                    </td>
                                    {!isMobile && <td className="table-item__property">{block.rarity}</td>}
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
