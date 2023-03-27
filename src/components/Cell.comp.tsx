type Props = {
    isHit: boolean | null
    colorHex?: string
    pattern: string
    isAttacked?: boolean
    onClick?: () => void
    disabled?: boolean
}

export default function Cell({ isHit, colorHex, onClick, isAttacked, disabled, pattern }: Props) {
    return (
        <div
            className={`${!isHit && `pattern__${pattern} `}game-board__cell${
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
                color: isHit !== null ? '' : colorHex ?? ''
            }}
        />
    )
}
