import { useCallback, useEffect, useState } from 'react'
import { Link, Outlet } from 'react-router-dom'

import { useUserContext } from '@/context/UserContext'
import { fetchBalance } from '@/flow/fetchBalance.script'
import { removeToken } from '@/utils/token'

export default function Home() {
    const { user, setUser } = useUserContext()
    const [balance, setBalance] = useState<number>()

    useEffect(() => {
        const getBalance = async () => {
            const result = await fetchBalance(user?.custodialWalletAddress ?? '')
            setBalance(result)
        }

        getBalance()
    }, [user?.custodialWalletAddress])

    const logout = useCallback(() => {
        setUser(null)

        removeToken()
    }, [])

    return (
        <div className="home">
            <div className="logo">
                battle <br /> bl
                <div className="white-square white-square--small" />
                cks
            </div>
            <Outlet />
            <div className="footer">
                <div className="footer__navigation">
                    <Link to="/">play</Link> / <Link to="profile">profile</Link> / <Link to="shop">shop</Link> /{' '}
                    <span className="logout" onClick={() => logout()}>
                        logout
                    </span>
                </div>
                <div className="footer__user-info">
                    <div className="footer__user-info__username">username: {user?.username}</div> /
                    <div className="footer__user-info__balance">
                        balance: {!balance ? (0).toFixed(2) : balance?.toFixed(2)} FLOW
                    </div>
                </div>
            </div>
        </div>
    )
}
