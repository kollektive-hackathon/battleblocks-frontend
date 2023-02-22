import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'

import Loader from '@/components/Loader.comp'
import Login from '@/pages/Login.page'

export default function App() {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null)

    useEffect(() => {
        const storedToken = localStorage.getItem('token') ? JSON.parse(localStorage.getItem('token')!) : null

        // TODO: check token and log user in if it's valid
        // also move state to context
        setIsLoggedIn(!!storedToken)
    }, [])

    if (isLoggedIn === null) {
        return <Loader />
    }

    if (!isLoggedIn) {
        return <Login />
    }

    return <Outlet />
}
