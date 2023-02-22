import { useEffect, useState } from 'react'

import Login from './pages/Login.page'

export default function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    useEffect(() => {
        const storedToken = localStorage.getItem('token') ? JSON.parse(localStorage.getItem('token')!) : null

        // TODO: check token and log user in if it's valid
    }, [])

    if (!isLoggedIn) {
        return <Login />
    }

    return <div className="app">battleblocks</div>
}
