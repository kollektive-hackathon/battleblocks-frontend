import { Link, Outlet } from 'react-router-dom'

import { useNotificationContext } from '@/context/NotificationContext'
import { useUserContext } from '@/context/UserContext'

export default function Home() {
    const { user } = useUserContext()
    const { notification } = useNotificationContext()

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
                    <Link to="/">play</Link> / <Link to="profile">profile</Link> / <Link to="shop">shop</Link>
                </div>
                <div className="footer__user-info">
                    <div className="footer__user-info__username">username: {user?.username}</div> /
                    <div className="footer__user-info__ratio">record: 44w - 31l</div> /
                    <div className="footer__user-info__balance">balance: 333.49 usdc</div>
                </div>
            </div>
            {!!notification && (
                <div className="notification">
                    <div className="notification__title">{notification.title}!&gt;</div>
                    <div className="notification__description">{notification.description}</div>
                </div>
            )}
        </div>
    )
}
