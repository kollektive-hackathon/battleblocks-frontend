import { useState } from 'react'

type Props = {
    isRevealedDefault: boolean
    isShipDefault: boolean
}

export default function Cell(props: Props) {
    const { isRevealedDefault, isShipDefault } = props
    const [isRevealed, setIsRevealed] = useState(isRevealedDefault)
    const [isShip] = useState(isShipDefault)

    return (
        <div
            className={`game-board__cell${
                isRevealed ? (isShip ? ' game-board__cell--hit' : ' game-board__cell--miss') : ''
            }`}
            onClick={() => setIsRevealed(true)}
        />
    )
}
