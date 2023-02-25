import { useState } from 'react'

import PurchaseModal from '@/components/PurchaseModal.comp'
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

    const [purchaseItem, setPurchaseItem] = useState<ShopItem>()

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
                            <tr key={item.id} className="table-item" onClick={() => setPurchaseItem(item)}>
                                <td className="table-item__property">{item.name}</td>
                                <td className="table-item__property">{item.blockType}</td>
                                <td className="table-item__property">{item.rarity}</td>
                                <td className="table-item__property">${item.price}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {!!purchaseItem && <PurchaseModal item={purchaseItem} closeModal={() => setPurchaseItem(undefined)} />}
        </div>
    )
}
