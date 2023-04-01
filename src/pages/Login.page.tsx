import { useCallback, useState } from 'react'
import { TokenResponse, useGoogleLogin } from '@react-oauth/google'
import axios from 'axios'

import { useNotificationContext } from '@/context/NotificationContext'
import { useUserContext } from '@/context/UserContext'
import { useIsMobile } from '@/hooks/isMobile.hook'
import { persistToken } from '@/utils/token'

export default function Login() {
    // default has to be true because of conditions in rendering, will be set to false if user isn't registered
    const [isRegistered, setIsRegistered] = useState(true)
    const [username, setUsername] = useState('')
    const { setUser, setEmail } = useUserContext()
    const { setNotification } = useNotificationContext()
    const { isMobile } = useIsMobile()

    const authenticateGoogle = useCallback(
        // eslint-disable-next-line camelcase
        async ({ access_token }: TokenResponse) => {
            try {
                const { data } = await axios.post('/auth/google', {
                    accessToken: access_token
                })

                const { idToken, refreshToken, profile } = data

                persistToken(idToken, refreshToken)

                setUser(profile ?? null)

                setIsRegistered(!!profile)
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
            const { data } = await axios.post('/registration', {
                username
            })

            setUser(data)

            setEmail(data.email)
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
                {isRegistered ? (
                    <>
                        {!isMobile ? (
                            <div className="login__title">
                                battlebl
                                <div className="white-square" />
                                cks
                            </div>
                        ) : (
                            <div className="logo">
                                battle <br /> bl
                                <div className="white-square white-square--smaller" />
                                cks
                            </div>
                        )}
                        <div className="login__message">continue?with&gt;</div>
                        <div className="login__container">
                            <div
                                className="login__container__app login__container__app--google"
                                onClick={() => login()}
                            >
                                <img src="/public/icons/google.svg" alt="Google login" />
                            </div>
                            {/* <div className="login__container__app login__container__app--twitter">
                                <img src="/public/icons/twitter.svg" alt="Twitter login" />
                            </div> */}
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
