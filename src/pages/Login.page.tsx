import { useCallback } from 'react'
import { TokenResponse, useGoogleLogin } from '@react-oauth/google'
import axios from 'axios'

import { useUserContext } from '@/context/UserContext'

export default function Login() {
    const { setUser } = useUserContext()

    const authenticateGoogle = useCallback(
        // eslint-disable-next-line camelcase
        async ({ access_token }: TokenResponse) => {
            // TODO: change endpoint when BE is deployed
            try {
                const { data } = await axios.post('http://localhost:8000/battleblocks-api/auth/google', {
                    accessToken: access_token
                })

                const { idToken, refreshToken, user } = data

                axios.defaults.headers.common.Authorization = `Bearer ${idToken}`

                localStorage.setItem('authToken', idToken)

                localStorage.setItem('refreshToken', refreshToken)

                localStorage.setItem('user', JSON.stringify(user))

                setUser(user)
            } catch (e) {
                // TODO: handle this with toast notification
                // eslint-disable-next-line no-console
                console.error('Error with Google Auth endpoint')
            }
        },
        [setUser]
    )

    const login = useGoogleLogin({ onSuccess: authenticateGoogle })

    return (
        <div className="login">
            <div className="login__content">
                <div className="login__title">
                    battlebl
                    <div className="white-square" />
                    cks
                </div>
                <div className="login__message">continue?with&gt;</div>
                <div className="login__container">
                    <div className="login__container__app login__container__app--google" onClick={() => login()}>
                        <img src="/icons/google.svg" alt="Google login" />
                    </div>
                    <div className="login__container__app login__container__app--twitter">
                        <img src="/icons/twitter.svg" alt="Twitter login" />
                    </div>
                </div>
            </div>
            <div className="login__footer">
                BATTLEBLOCKS is an open-source decentralized application developed by the team of the same name as part
                of the FLOW Hackathon 2023, held from February 21st to 26th. The dApp is not affiliated with any other
                organizations or entities and is provided &quot;as is&quot; without any warranties of any kind, express
                or implied. Your use of the dApp is entirely at your own risk and under your own discretion.
            </div>
        </div>
    )
}
