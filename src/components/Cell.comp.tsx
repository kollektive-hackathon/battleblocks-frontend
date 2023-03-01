type Props = {
    isHit: boolean | null
    colorHex?: string
    isAttacked?: boolean
    onClick?: () => void
    disabled?: boolean
}

export default function Cell(props: Props) {
    const { isHit, colorHex, onClick, isAttacked, disabled } = props

    return (
        <div
            className={`game-board__cell${
                isHit !== null
                    ? isHit
                        ? ' game-board__cell--hit'
                        : ' game-board__cell--miss'
                    : isAttacked
                    ? ' game-board__cell--try'
                    : ''
            }`}
            onClick={onClick && !disabled ? () => onClick() : () => {}}
            style={{
                cursor: !onClick ? 'default' : isHit !== null || isAttacked || disabled ? 'not-allowed' : 'pointer',
                backgroundColor: colorHex ?? ''
            }}
        />
    )
}
