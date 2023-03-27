import { useEffect, useState } from 'react'
import axios from 'axios'

import Loader from '@/components/Loader.comp'
import PurchaseModal from '@/components/PurchaseModal.comp'
import { useNotificationContext } from '@/context/NotificationContext'
import { BlockItem } from '@/types/block'

export default function Shop() {
    const [items, setItems] = useState<BlockItem[]>()

    const [purchaseItem, setPurchaseItem] = useState<BlockItem>()
    const { setNotification } = useNotificationContext()

    useEffect(() => {
        axios
            .get('/shop')
            .then((result) => setItems(result.data))
            .catch(() => setNotification({ title: 'shop-error', description: 'error fetching shop items' }))
    }, [])

    return (
        <div className="shop page-container">
            <div className="page-container__title">shop //</div>

            <div className="page-container__content page-container__content--scrollable">
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
