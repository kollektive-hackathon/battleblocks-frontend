export const RarityEnum = {
    Epic: 'epic',
    Rare: 'rare',
    Common: 'common',
    Legendary: 'legendary'
} as const

export type Rarity = (typeof RarityEnum)[keyof typeof RarityEnum]
