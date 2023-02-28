import axios from 'axios'

export const getLocalRefreshToken = () => window.localStorage.getItem('battleblocks_refreshToken')

export const getLocalIdToken = () => window.localStorage.getItem('battleblocks_authToken')

export const getRefreshedToken = async () => {
    const refreshToken = getLocalRefreshToken()
    if (refreshToken) {
        return (await axios.post('/auth/refresh', { refreshToken })).data
    }

    return null
}

export const persistToken = (token: string, refreshToken: string) => {
    axios.defaults.headers.common.Authorization = `Bearer ${token}`

    localStorage.setItem('battleblocks_authToken', token)

    localStorage.setItem('battleblocks_refreshToken', refreshToken)
}

export const removeToken = () => {
    delete axios.defaults.headers.common.Authorization

    localStorage.removeItem('battleblocks_authToken')

    localStorage.removeItem('battleblocks_refreshToken')
}
