import { useEffect, useState } from 'react'
import axios from 'axios'

import Block from '@/components/Block.comp'
import Loader from '@/components/Loader.comp'
import PurchaseModal from '@/components/PurchaseModal.comp'
import { useNotificationContext } from '@/context/NotificationContext'
import { useIsMobile } from '@/hooks/isMobile.hook'
import { BlockItem } from '@/types/block'

export default function Shop() {
    const [items, setItems] = useState<BlockItem[]>()
    const [purchaseItem, setPurchaseItem] = useState<BlockItem>()

    const { setNotification } = useNotificationContext()
    const { isMobile } = useIsMobile()

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
                            {!isMobile && <th>rarity</th>}
                            <th>price</th>
                        </tr>
                    </thead>

                    <tbody>
                        {items ? (
                            items
                                .sort((a, b) => a.price! - b.price!)
                                .map((item) => (
                                    <tr key={item.id} className="table-item" onClick={() => setPurchaseItem(item)}>
                                        <td className="table-item__property">{item.name}</td>
                                        <td className="table-item__property">
                                            <Block block={item} isSmall />
                                        </td>
                                        {!isMobile && <td className="table-item__property">{item.rarity}</td>}
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
