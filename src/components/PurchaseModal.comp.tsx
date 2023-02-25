import { useState } from 'react'
import { PayPalButtons } from '@paypal/react-paypal-js'

import { useNotificationContext } from '@/context/NotificationContext'
import { ShopItem } from '@/types/shop'

type Props = {
    item: ShopItem
    closeModal: () => void
}
export default function PurchaseModal(props: Props) {
    const { item, closeModal } = props
    const [showPaypal, setShowPaypal] = useState(false)
    const { setNotification } = useNotificationContext()

    return (
        <div className="modal-backdrop" onClick={() => closeModal()}>
            <div className="purchase-modal" onClick={(e) => e.stopPropagation()}>
                <div className="purchase-modal__title">
                    {item.name} // {item.blockType} // {item.rarity}
                </div>
                <div className="purchase-modal__preview">mcdick</div>
                <div className="purchase-modal__price">total: ${item.price}</div>
                <div className="purchase-modal__paypal" onClick={() => setShowPaypal(true)}>
                    continue with paypal &gt;&gt;
                </div>
                {showPaypal && (
                    <PayPalButtons
                        createOrder={
                            (data, actions) =>
                                actions.order.create({
                                    purchase_units: [
                                        {
                                            amount: {
                                                value: item.price.toString()
                                            }
                                        }
                                    ]
                                })
                            // eslint-disable-next-line
                        }
                        onApprove={() => {
                            closeModal()

                            setNotification({
                                title: 'purchase-complete',
                                description: 'nft is being delivered'
                            })

                            return Promise.resolve()
                        }}
                    />
                )}
            </div>
        </div>
    )
}
