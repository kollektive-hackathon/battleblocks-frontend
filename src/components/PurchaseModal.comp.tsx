import { ShopItem } from '@/types/shop'

type Props = {
    item: ShopItem
    closeModal: () => void
}
export default function PurchaseModal(props: Props) {
    const { item, closeModal } = props

    return (
        <div className="modal-backdrop" onClick={() => closeModal()}>
            <div className="purchase-modal" onClick={(e) => e.stopPropagation()}>
                <div className="purchase-modal__title">
                    {item.name} // {item.blockType} // {item.rarity}
                </div>
                <div className="purchase-modal__preview">mcdick</div>
                <div className="purchase-modal__price">total: ${item.price}</div>
                <div className="purchase-modal__paypal">continue with paypal &gt;&gt;</div>
            </div>
        </div>
    )
}
