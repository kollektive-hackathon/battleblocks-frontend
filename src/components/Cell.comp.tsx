import { useState } from 'react'

type Props = {
    isRevealedDefault: boolean
    isShipDefault: boolean
    myBoard: boolean
    colorHex: string
}

export default function Cell(props: Props) {
    const { isRevealedDefault, isShipDefault, myBoard, colorHex } = props
    const [isRevealed, setIsRevealed] = useState(isRevealedDefault)
    const [isShip] = useState(isShipDefault)

    return (
        <div
            className={`game-board__cell${
                isRevealed ? (isShip ? ' game-board__cell--hit' : ' game-board__cell--miss') : ''
            }`}
            onClick={!myBoard ? () => setIsRevealed(true) : () => {}}
            style={{ cursor: myBoard ? 'default' : isRevealed ? 'not-allowed' : 'pointer', backgroundColor: colorHex }}
        />
    )
}
