import { useState } from 'react'
import { PayPalButtons } from '@paypal/react-paypal-js'

import Block from '@/components/Block.comp'
import { useNotificationContext } from '@/context/NotificationContext'
import { useUserContext } from '@/context/UserContext'
import { BlockItem } from '@/types/block'

type Props = {
    item: BlockItem
    closeModal: () => void
}
export default function PurchaseModal({ item, closeModal }: Props) {
    const [showPaypal, setShowPaypal] = useState(false)
    const { setNotification } = useNotificationContext()
    const { user } = useUserContext()

    return (
        <div className="modal-backdrop" onClick={() => closeModal()}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal__title">
                    {item.name} // {item.blockType} // {item.rarity}
                </div>
                <div className="modal__preview">
                    <Block block={item} />
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
                                                value: item.price!.toString()
                                            },
                                            custom_id: item.id.toString(),
                                            description: user?.id.toString()
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
