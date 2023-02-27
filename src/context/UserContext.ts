import { createContext, useContext } from 'react'

export type User = {
    username: string
    id: number
    email: string
    custodialWalletAddress: string
    selfCustodyWalletAddress?: string
}

export type BloctoUser = {
    addr: string | null
    isLoggedIn: boolean | null
}

type TUserContext = {
    user?: User | null
    setUser: (user: User) => void
    bloctoUser?: BloctoUser
}

export const UserContext = createContext<TUserContext>({
    setUser: () => {}
})

export const useUserContext = () => {
    const context = useContext(UserContext)

    if (!context) {
        throw new Error('useUserContext was used outside of its provider')
    }

    return context
}
