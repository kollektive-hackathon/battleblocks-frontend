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

    const [aLocations, bLocations] = useMemo(() => {
        const a = item.blockType.substring(
            1,
            item.blockType.indexOf('b') === -1 ? item.blockType.length : item.blockType.indexOf('b')
        )

        const b = item.blockType.substring(
            item.blockType.indexOf('b') === -1 ? item.blockType.length : item.blockType.indexOf('b') + 1,
            item.blockType.length
        )

        return [a.split(''), b.split('')]
    }, [item.blockType])

    return (
        <div className="modal-backdrop" onClick={() => closeModal()}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal__title">
                    {item.name} // {item.blockType} // {item.rarity}
                </div>
                <div className="modal__preview">
                    {[...Array(2).keys()].map(
                        (numero) =>
                            (numero === 0 ? aLocations : bLocations).includes((numero + 1).toString()) && (
                                <div key={numero} className="modal__preview__row">
                                    {[...Array(4).keys()].map(
                                        (num) =>
                                            (numero === 0 ? aLocations : bLocations).some(
                                                (number: string) => number >= (num + 1).toString()
                                            ) && (
                                                <div
                                                    key={num}
                                                    className="modal__preview__cell"
                                                    style={{
                                                        backgroundColor: (numero === 0
                                                            ? aLocations
                                                            : bLocations
                                                        ).includes((num + 1).toString())
                                                            ? item.colorHex
                                                            : '#d9d9d9'
                                                    }}
                                                />
                                            )
                                    )}
                                </div>
                            )
                    )}
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
