import axios from 'axios'

import { API_URL } from '@/config/variables'

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
