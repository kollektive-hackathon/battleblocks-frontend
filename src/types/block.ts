import { Rarity } from '@/types/shop'

export type BlockItem = {
    id: number
    name: string
    blockType: string
    rarity: Rarity
    colorHex: string
    pattern: string
    active?: boolean
    price?: number
}
