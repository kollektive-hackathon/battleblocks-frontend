import { useEffect, useState } from 'react'
import axios from 'axios'

import Loader from '@/components/Loader.comp'
import PurchaseModal from '@/components/PurchaseModal.comp'
import { API_URL } from '@/config/variables'
import { useNotificationContext } from '@/context/NotificationContext'
import { ShopItem } from '@/types/shop'

export default function Shop() {
    const [items, setItems] = useState<ShopItem[]>()

    const [purchaseItem, setPurchaseItem] = useState<ShopItem>()
    const { setNotification } = useNotificationContext()

    useEffect(() => {
        axios
            .get(`${API_URL}/shop`)
            .then((result) => setItems(result.data))
            .catch(() => setNotification({ title: 'shop-error', description: 'error fetching shop items' }))
    }, [])

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
                        {items ? (
                            items.map((item) => (
                                <tr key={item.id} className="table-item" onClick={() => setPurchaseItem(item)}>
                                    <td className="table-item__property">{item.name}</td>
                                    <td className="table-item__property">{item.blockType}</td>
                                    <td className="table-item__property">{item.rarity}</td>
                                    <td className="table-item__property">${item.price}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td style={{ backgroundColor: 'black' }}>
                                    <Loader />
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {!!purchaseItem && <PurchaseModal item={purchaseItem} closeModal={() => setPurchaseItem(undefined)} />}
        </div>
    )
}
