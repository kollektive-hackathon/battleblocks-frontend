export const RarityEnum = {
    Epic: 'epic',
    Rare: 'rare',
    Common: 'common',
    Legendary: 'legendary'
} as const

export type Rarity = (typeof RarityEnum)[keyof typeof RarityEnum]

export type ShopItem = {
    id: number
    name: string
    blockType: string
    rarity: Rarity
    price: number
    colorHex: string
}
