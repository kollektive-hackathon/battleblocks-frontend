import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import Error from '@/pages/Error.page'
import Game from '@/pages/Game.page'
import Home from '@/pages/Home.page'
import Profile from '@/pages/Profile.page'
import Shop from '@/pages/Shop.page'

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
                        path: 'shop',
                        element: <Shop />
                    },
                    {
                        path: 'profile',
                        element: <Profile />
                    },
                    {
                        path: 'game/:id',
                        element: <Game />
                    }
                ]
            }
        ]
    }
])

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
)
