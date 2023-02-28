import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useNotificationContext } from '@/context/NotificationContext'
import { useUserContext } from '@/context/UserContext'
import { fetchBalance } from '@/flow/fetchBalance.script'

type Props = {
    closeModal: () => void
}

export default function CreateMatchModal(props: Props) {
    const { closeModal } = props
    const [stake, setStake] = useState<number>()
    const { setNotification } = useNotificationContext()
    const { user } = useUserContext()
    const navigate = useNavigate()

    const createMatch = useCallback(async () => {
        const balance = await fetchBalance(user?.custodialWalletAddress ?? '')
        if (balance < (stake ?? 0)) {
            setNotification({
                title: 'invalid-stake',
                description: `you don't have enough FLOW`
            })

            return
        }

        if (!stake || stake <= 0) {
            setNotification({
                title: 'invalid-stake',
                description: 'stake must be greater than 0'
            })

            return
        }

        navigate('/game/new', { state: { stake } })

        closeModal()
    }, [stake, closeModal])

    return (
        <div className="modal-backdrop" onClick={() => closeModal()}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal__title">create match</div>
                <div className="modal__stake">
                    <input
                        type="number"
                        className="modal__input"
                        placeholder="stake?amount"
                        onChange={(event) => setStake(+event.target.value)}
                        onKeyUp={(e) => {
                            if (e.key === 'Enter') {
                                createMatch()
                            }
                        }}
                        autoFocus
                    />
                    flow
                </div>
                <div className="modal__cta" onClick={() => createMatch()}>
                    finish &gt;&gt;
                </div>
            </div>
        </div>
    )
}
