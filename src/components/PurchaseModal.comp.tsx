import { useMemo, useState } from 'react'
import { PayPalButtons } from '@paypal/react-paypal-js'

import { useNotificationContext } from '@/context/NotificationContext'
import { useUserContext } from '@/context/UserContext'
import { ShopItem } from '@/types/shop'

type Props = {
    item: ShopItem
    closeModal: () => void
}
export default function PurchaseModal(props: Props) {
    const { item, closeModal } = props
    const [showPaypal, setShowPaypal] = useState(false)
    const { setNotification } = useNotificationContext()
    const { user } = useUserContext()

    const [width, height] = useMemo(() => {
        const [x, y] = item.blockType.split('x')

        return [+x, +y]
    }, [item.blockType])

    return (
        <div className="modal-backdrop" onClick={() => closeModal()}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal__title">
                    {item.name} // {item.blockType} // {item.rarity}
                </div>
                <div className="modal__preview">
                    {[...Array(height)].map((numero) => (
                        <div key={numero} className="modal__preview__row">
                            {[...Array(width)].map((num) => (
                                <div
                                    key={num}
                                    className="modal__preview__cell"
                                    style={{ backgroundColor: item.colorHex }}
                                />
                            ))}
                        </div>
                    ))}
                </div>
                <div className="modal__price">total: ${item.price}</div>
                <div className="modal__cta" onClick={() => setShowPaypal(true)}>
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
                                            },
                                            custom_id: item.id.toString(),
                                            description: user?.custodialWalletAddress
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
                        onError={() => {
                            setNotification({
                                title: 'paypal-error',
                                description: 'something went wrong with paypal'
                            })
                        }}
                    />
                )}
            </div>
        </div>
    )
}
