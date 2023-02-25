import { createContext, useContext } from 'react'

export type Notification = {
    title: string
    description: string
}

type TNotificationContext = {
    notification: Notification | null
    setNotification: (notification: Notification) => void
}

export const NotificationContext = createContext<TNotificationContext>({
    notification: null,
    setNotification: () => {}
})

export const useNotificationContext = () => {
    const context = useContext(NotificationContext)

    if (!context) {
        throw new Error('useNotificationContext was used outside of its provider')
    }

    return context
}
