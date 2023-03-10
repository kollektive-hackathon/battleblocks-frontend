import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { PayPalScriptProvider } from '@paypal/react-paypal-js'
import { GoogleOAuthProvider } from '@react-oauth/google'

import { GOOGLE_AUTH_CLIENT_ID, PAYPAL_CLIENT_ID } from '@/config/variables'
import Error from '@/pages/Error.page'
import Game from '@/pages/Game.page'
import Home from '@/pages/Home.page'
import Lobby from '@/pages/Lobby.page'
import NewGame from '@/pages/NewGame.page'
import Profile from '@/pages/Profile.page'
import Shop from '@/pages/Shop.page'

import '@/config/flow.config'

import App from './App'

import '@/style/index.scss'

const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        errorElement: <Error />,
        children: [
            {
                path: '',
                element: <Home />,
                children: [
                    {
                        path: '/',
                        element: <Lobby />
                    },
                    {
                        path: 'shop',
                        element: <Shop />
                    },
                    {
                        path: 'profile',
                        element: <Profile />
                    },
                    {
                        path: 'game/new',
                        element: <NewGame isJoin={false} />
                    },
                    {
                        path: 'game/:id',
                        element: <Game />
                    },
                    {
                        path: 'game/:id/join',
                        element: <NewGame isJoin />
                    }
                ]
            }
        ]
    }
])

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <GoogleOAuthProvider clientId={GOOGLE_AUTH_CLIENT_ID}>
            <PayPalScriptProvider
                options={{
                    'client-id': PAYPAL_CLIENT_ID,
                    currency: 'USD'
                }}
            >
                <RouterProvider router={router} />
            </PayPalScriptProvider>
        </GoogleOAuthProvider>
    </React.StrictMode>
)
