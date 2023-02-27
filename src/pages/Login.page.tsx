import { useCallback, useState } from 'react'
import { TokenResponse, useGoogleLogin } from '@react-oauth/google'
import axios from 'axios'

import { useNotificationContext } from '@/context/NotificationContext'
import { useUserContext } from '@/context/UserContext'

export default function Login() {
    const { setUser, user } = useUserContext()
    const [hasUsername, setHasUsername] = useState(true)
    const [username, setUsername] = useState('')
    const { setNotification } = useNotificationContext()

    const authenticateGoogle = useCallback(
        // eslint-disable-next-line camelcase
        async ({ access_token }: TokenResponse) => {
            try {
                const { data } = await axios.post(`${process.env.API_URL}/auth/google`, {
                    accessToken: access_token
                })

                const { idToken, refreshToken, profile } = data

                axios.defaults.headers.common.Authorization = `Bearer ${idToken}`

                localStorage.setItem('battleblocks_authToken', idToken)

                localStorage.setItem('battleblocks_refreshToken', refreshToken)

                localStorage.setItem('battleblocks_user', JSON.stringify(profile))

                setUser(profile)

                setHasUsername(!!profile)
            } catch (e) {
                setNotification({
                    title: 'google-error',
                    description: 'something went wrong with google login'
                })
            }
        },
        [setUser, setNotification]
    )

    const login = useGoogleLogin({ onSuccess: authenticateGoogle })

    const submitUsername = useCallback(async () => {
        if (!username) {
            setNotification({
                title: 'username-error',
                description: 'please enter username'
            })

            return
        }

        try {
            await axios.post(`${process.env.API_URL}/registration`, {
                username
            })
        } catch (e) {
            setNotification({
                title: 'registration-error',
                description: 'something went wrong while registering'
            })
        }
    }, [username])

    return (
        <div className="login">
            <div className="login__content">
                {user ? (
                    <>
                        <div className="login__title">
                            battlebl
                            <div className="white-square" />
                            cks
                        </div>
                        <div className="login__message">continue?with&gt;</div>
                        <div className="login__container">
                            <div
                                className="login__container__app login__container__app--google"
                                onClick={() => login()}
                            >
                                <img src="/icons/google.svg" alt="Google login" />
                            </div>
                            <div className="login__container__app login__container__app--twitter">
                                <img src="/icons/twitter.svg" alt="Twitter login" />
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="logo">
                            battle <br /> bl
                            <div className="white-square white-square--small" />
                            cks
                        </div>
                        <div className="register">
                            <div className="register__title">enter?your-username&gt;</div>
                            <div className="register__input-container">
                                <input
                                    type="text"
                                    className="register__input"
                                    onChange={(e) => setUsername(e.target.value)}
                                    onKeyUp={(e) => {
                                        if (e.key === 'Enter') {
                                            submitUsername()
                                        }
                                    }}
                                />
                                <div
                                    className="register__submit"
                                    onClick={() => submitUsername()}
                                    style={{ cursor: username ? 'pointer' : 'not-allowed' }}
                                >
                                    &gt;&gt;
                                </div>
                            </div>
                        </div>
                    </>
                )}
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
