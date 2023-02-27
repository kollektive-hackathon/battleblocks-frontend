import { Rarity } from '@/types/shop'

export type BlockItem = {
    id: number
    name: string
    blockType: string
    rarity: Rarity
    colorHex: string
    active?: boolean
    price?: number
}
