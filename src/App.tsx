import { useCallback, useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'

import Loader from '@/components/Loader.comp'
import { Notification, NotificationContext } from '@/context/NotificationContext'
import Login from '@/pages/Login.page'

import { User, UserContext } from './context/UserContext'

export default function App() {
    const [user, setUser] = useState<User | null>()
    const [notification, setNotification] = useState<Notification | null>(null)

    useEffect(() => {
        const storedUser = localStorage.getItem('battleblocks_user')
            ? JSON.parse(localStorage.getItem('battleblocks_user')!)
            : null

        // TODO: check token and log user in if it's valid
        setUser(storedUser)
    }, [])

    const setNotificationWithTimeout = useCallback((newNotification: Notification) => {
        setNotification(newNotification)

        setTimeout(() => {
            setNotification(null)
        }, 5000)
    }, [])

    return (
        <NotificationContext.Provider value={{ notification, setNotification: setNotificationWithTimeout }}>
            <UserContext.Provider value={{ user, setUser }}>
                {user === undefined ? <Loader /> : user === null ? <Login /> : <Outlet />}
            </UserContext.Provider>
        </NotificationContext.Provider>
    )
}
