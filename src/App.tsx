import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'

import Login from '@/pages/Login.page'

export default function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    useEffect(() => {
        const storedToken = localStorage.getItem('token') ? JSON.parse(localStorage.getItem('token')!) : null

        // TODO: check token and log user in if it's valid
        setIsLoggedIn(!!storedToken)
    }, [])

    if (!isLoggedIn) {
        return <Login />
    }

    return <Outlet />
}
