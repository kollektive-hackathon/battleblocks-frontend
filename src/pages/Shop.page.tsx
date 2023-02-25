import { useState } from 'react'

import { ShopItem } from '@/types/shop'

export default function Shop() {
    const [items] = useState<ShopItem[]>([
        {
            id: 0,
            name: 'red tube',
            blockType: '4x1',
            rarity: 'epic',
            price: 33,
            colorHex: '#131414'
        },
        {
            id: 1,
            name: 'blue ivy',
            blockType: '2x2',
            rarity: 'rare',
            price: 69,
            colorHex: '#696969'
        },
        {
            id: 2,
            name: 'red tube',
            blockType: '4x1',
            rarity: 'epic',
            price: 33,
            colorHex: '#131414'
        },
        {
            id: 3,
            name: 'blue ivy',
            blockType: '2x2',
            rarity: 'rare',
            price: 69,
            colorHex: '#696969'
        },
        {
            id: 4,
            name: 'red tube',
            blockType: '4x1',
            rarity: 'epic',
            price: 33,
            colorHex: '#131414'
        },
        {
            id: 5,
            name: 'blue ivy',
            blockType: '2x2',
            rarity: 'rare',
            price: 69,
            colorHex: '#696969'
        },
        {
            id: 6,
            name: 'red tube',
            blockType: '4x1',
            rarity: 'epic',
            price: 33,
            colorHex: '#131414'
        },
        {
            id: 7,
            name: 'blue ivy',
            blockType: '2x2',
            rarity: 'rare',
            price: 69,
            colorHex: '#696969'
        }
    ])

    return (
        <div className="shop page-container">
            <div className="page-container__title">shop //</div>
            <div className="page-container__content">
                <table className="page-container__content__table">
                    <thead>
                        <tr>
                            <th>skin name</th>
                            <th>block type</th>
                            <th>rarity</th>
                            <th>price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item) => (
                            <tr key={item.id} className="shop-item">
                                <td className="shop-item__name">{item.name}</td>
                                <td className="shop-item__block-type">{item.blockType}</td>
                                <td className="shop-item__rarity">{item.rarity}</td>
                                <td className="shop-item__price">${item.price}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
