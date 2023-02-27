import { useCallback, useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import * as fcl from '@onflow/fcl'

import Loader from '@/components/Loader.comp'
import { Notification, NotificationContext } from '@/context/NotificationContext'
import { useResize } from '@/hooks/useResize.hook'
import Login from '@/pages/Login.page'

import { User, UserContext } from './context/UserContext'

export default function App() {
    const [user, setUser] = useState<User | null>()
    const [bloctoUser, setBloctoUser] = useState()
    const [notification, setNotification] = useState<Notification | null>(null)
    const { showOverlay, setShowOverlay, resizeCallback } = useResize()

    useEffect(() => {
        const storedUser = localStorage.getItem('battleblocks_user')
            ? JSON.parse(localStorage.getItem('battleblocks_user')!)
            : null

        // TODO: check token and log user in if it's valid
        setUser(storedUser)

        fcl.currentUser.subscribe(setBloctoUser)

        // initial call, afterwards useEffect will take care of everything :)
        resizeCallback()
    }, [])

    const setNotificationAndUnset = useCallback((newNotification: Notification) => {
        setNotification(newNotification)

        setTimeout(() => {
            setNotification(null)
        }, 5000)
    }, [])

    return (
        <NotificationContext.Provider value={{ notification, setNotification: setNotificationAndUnset }}>
            <UserContext.Provider value={{ user, setUser, bloctoUser }}>
                <>
                    {user === undefined ? <Loader /> : user === null ? <Login /> : <Outlet />}
                    {!!notification && (
                        <div className="notification">
                            <div className="notification__title">{notification.title}!&gt;</div>
                            <div className="notification__description">{notification.description}</div>
                        </div>
                    )}
                    {showOverlay && (
                        <div className="modal-backdrop" onClick={() => setShowOverlay(false)}>
                            for optimal experience, please use app in full screen
                        </div>
                    )}
                </>
            </UserContext.Provider>
        </NotificationContext.Provider>
    )
}
