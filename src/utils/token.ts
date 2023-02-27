import axios from 'axios'

import { API_URL } from '@/config/variables'
import { User } from '@/context/UserContext'

export const getLocalRefreshToken = () => window.localStorage.getItem('battleblocks_refreshToken')

export const getLocalIdToken = () => window.localStorage.getItem('battleblocks_authToken')

export const getRefreshedToken = async () => {
    const refreshToken = getLocalRefreshToken()
    if (refreshToken) {
        return (await axios.post(`${API_URL}/refresh`, { refreshToken })).data
    }

    return null
}

export const persistTokenAndUser = (token: string, refreshToken: string, user?: User) => {
    axios.defaults.headers.common.Authorization = `Bearer ${token}`

    localStorage.setItem('battleblocks_authToken', token)

    localStorage.setItem('battleblocks_refreshToken', refreshToken)

    if (user) {
        localStorage.setItem('battleblocks_user', JSON.stringify(user))
    }
}

export const removeTokenAndUser = () => {
    delete axios.defaults.headers.common.Authorization

    localStorage.removeItem('battleblocks_authToken')

    localStorage.removeItem('battleblocks_refreshToken')

    localStorage.removeItem('battleblocks_user')
}
