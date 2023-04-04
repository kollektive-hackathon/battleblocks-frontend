import { useCallback, useEffect, useState } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { Outlet } from 'react-router-dom'
import * as fcl from '@onflow/fcl'
import axios from 'axios'

import Loader from '@/components/Loader.comp'
import { API_URL } from '@/config/variables'
import { Notification, NotificationContext } from '@/context/NotificationContext'
import Login from '@/pages/Login.page'
import { getLocalIdToken, getRefreshedToken, persistToken } from '@/utils/token'

import { User, UserContext } from './context/UserContext'

axios.interceptors.request.use(
    (config) => {
        const token = getLocalIdToken()

        if (token) {
            if (config.headers) {
                config.headers.Authorization = `Bearer ${token}`
            } else {
                config.headers = { Authorization: `Bearer ${token}` }
            }
        }

        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

axios.interceptors.response.use(
    (response) => {
        return response
    },
    async (err) => {
        const originalConfig = err.config
        if (err.response) {
            const token = getLocalIdToken()
            if (err.response.status === 401 && !originalConfig._retry && token) {
                originalConfig._retry = true

                try {
                    const data = await getRefreshedToken()
                    if (data?.idToken && data?.refreshToken) {
                        persistToken(data.idToken, data.refreshToken)
                    }

                    return axios(originalConfig)
                } catch (_error: any) {
                    if (_error.response && _error.response?.data) {
                        return Promise.reject(_error.response.data)
                    }

                    return Promise.reject(_error)
                }
            }

            if (err.response.status === 403 && err.response.data) {
                return Promise.reject(err.response.data)
            }
        }

        return Promise.reject(err)
    }
)

axios.defaults.baseURL = API_URL

export default function App() {
    const [user, setUser] = useState<User | null>()
    const [email, setEmail] = useState('')
    const [bloctoUser, setBloctoUser] = useState()
    const [notification, setNotification] = useState<Notification | null>(null)

    useEffect(() => {
        if (getLocalIdToken()) {
            fetchUser()
        } else {
            setUser(null)
        }

        fcl.currentUser.subscribe(setBloctoUser)
    }, [])

    useEffect(() => {
        if (email) {
            openSocket()
        }
    }, [email])

    const setNotificationAndUnset = useCallback((newNotification: Notification) => {
        setNotification(newNotification)

        setTimeout(() => {
            setNotification(null)
        }, 5000)
    }, [])

    const fetchUser = useCallback(async () => {
        axios
            .get('/profile')
            .then((result) => setUser(result.data))
            .catch(() => setUser(null))
    }, [])

    const openSocket = useCallback(() => {
        const sock = new WebSocket(`wss://battleblocks.lol/api/ws/registration/${email}`)

        sock.onmessage = (e) => {
            const { payload } = JSON.parse(e.data)

            setUser(payload)

            sock.close()

            setEmail('')
        }
    }, [email])

    return (
        <DndProvider backend={HTML5Backend}>
            <NotificationContext.Provider value={{ notification, setNotification: setNotificationAndUnset }}>
                <UserContext.Provider value={{ user, setUser, bloctoUser, email, setEmail }}>
                    <>
                        {user === undefined || email ? (
                            <>
                                <Loader />
                                {email ? (
                                    <div className="login-page__message">
                                        setting up account...
                                        <br />
                                        <br />
                                        this may take a while (seriously haha)
                                    </div>
                                ) : (
                                    ''
                                )}
                            </>
                        ) : user === null ? (
                            <Login />
                        ) : (
                            <Outlet />
                        )}
                        {!!notification && (
                            <div className="notification" onClick={() => setNotification(null)}>
                                <div className="notification__title">{notification.title}!&gt;</div>
                                <div className="notification__description">{notification.description}</div>
                            </div>
                        )}
                    </>
                </UserContext.Provider>
            </NotificationContext.Provider>
        </DndProvider>
    )
}
