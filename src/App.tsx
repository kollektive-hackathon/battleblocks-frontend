import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'

import Loader from '@/components/Loader.comp'
import Login from '@/pages/Login.page'

import { User, UserContext } from './context/UserContext'

export default function App() {
    const [user, setUser] = useState<User | null>()

    useEffect(() => {
        const storedUser = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null

        // TODO: check token and log user in if it's valid
        setUser(storedUser)
    }, [])

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {user === undefined ? <Loader /> : user === null ? <Login /> : <Outlet />}
        </UserContext.Provider>
    )
}
