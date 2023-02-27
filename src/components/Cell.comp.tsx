import { useState } from 'react'

type Props = {
    isRevealedDefault: boolean
    isShipDefault: boolean
    myBoard: boolean
}

export default function Cell(props: Props) {
    const { isRevealedDefault, isShipDefault, myBoard } = props
    const [isRevealed, setIsRevealed] = useState(isRevealedDefault)
    const [isShip] = useState(isShipDefault)

    return (
        <div
            className={`game-board__cell${
                isRevealed ? (isShip ? ' game-board__cell--hit' : ' game-board__cell--miss') : ''
            }`}
            onClick={!myBoard ? () => setIsRevealed(true) : () => {}}
            style={{ cursor: myBoard ? 'default' : isRevealed ? 'not-allowed' : 'pointer' }}
        />
    )
}
