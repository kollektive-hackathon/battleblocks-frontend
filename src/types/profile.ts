import { User } from '@/context/UserContext'
import { Rarity } from '@/types/shop'

type Block = {
    id: number
    name: string
    type: string
    rarity: Rarity
    active: boolean
}

export type UserProfile = User & { inventoryBlocks: Block[] }
