import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'

import { useUserContext } from '@/context/UserContext'
import { fetchBalance } from '@/flow/fetchBalance.script'
import { useIsMobile } from '@/hooks/isMobile.hook'
import { removeToken } from '@/utils/token'

const NAV_ITEMS = {
    Play: 'play',
    Profile: 'profile',
    Shop: 'shop'
}

export default function Home() {
    const [balance, setBalance] = useState<number>()
    const { user, setUser } = useUserContext()
    const { isMobile } = useIsMobile()
    const location = useLocation()

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

    const activeRoute = useMemo(
        () =>
            location.pathname.includes(NAV_ITEMS.Profile)
                ? NAV_ITEMS.Profile
                : location.pathname.includes(NAV_ITEMS.Shop)
                ? NAV_ITEMS.Shop
                : NAV_ITEMS.Play,
        [location]
    )

    return (
        <div className="home">
            {!isMobile ? (
                <div className="logo">
                    battle <br /> bl
                    <div className="white-square white-square--small" />
                    cks
                </div>
            ) : (
                <>
                    <div className="logo">
                        battlebl
                        <div className="white-square white-square--smaller" />
                        cks
                    </div>
                    <div className="user-info user-info--mobile">
                        <div className="user-info__username">username: {user?.username}</div> /
                        <div className="user-info__balance">
                            balance: {!balance ? (0).toFixed(2) : balance?.toFixed(2)} FLOW
                        </div>
                    </div>
                </>
            )}
            <Outlet />
            {!isMobile ? (
                <div className="footer">
                    <div className="footer__navigation">
                        <Link to="/">play</Link> / <Link to="profile">profile</Link> / <Link to="shop">shop</Link> /{' '}
                        <span className="logout" onClick={() => logout()}>
                            logout
                        </span>
                    </div>
                    <div className="user-info">
                        <div className="user-info__username">username: {user?.username}</div> /
                        <div className="user-info__balance">
                            balance: {!balance ? (0).toFixed(2) : balance?.toFixed(2)} FLOW
                        </div>
                    </div>
                </div>
            ) : (
                <div className="footer__mobile">
                    <Link to="/" className={activeRoute === NAV_ITEMS.Play ? 'active' : ''}>
                        {NAV_ITEMS.Play}
                    </Link>
                    <Link to="profile" className={activeRoute === NAV_ITEMS.Profile ? 'active' : ''}>
                        {NAV_ITEMS.Profile}
                    </Link>
                    <Link to="shop" className={activeRoute === NAV_ITEMS.Shop ? 'active' : ''}>
                        {NAV_ITEMS.Shop}
                    </Link>
                    <span className="logout" onClick={() => logout()}>
                        logout
                    </span>
                </div>
            )}
        </div>
    )
}
