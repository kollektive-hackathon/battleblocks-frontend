import { useMemo } from 'react'

import { BlockItem } from '@/types/block'

type Props = {
    block: BlockItem
    isDraggable?: boolean
}

export default function Block({ block, isDraggable }: Props) {
    const [aLocations, bLocations] = useMemo(() => {
        const a = block.blockType.substring(
            1,
            block.blockType.indexOf('b') === -1 ? block.blockType.length : block.blockType.indexOf('b')
        )

        const b = block.blockType.substring(
            block.blockType.indexOf('b') === -1 ? block.blockType.length : block.blockType.indexOf('b') + 1,
            block.blockType.length
        )

        return [a.split(''), b.split('')]
    }, [block.blockType])

    return (
        <div className="block">
            {[...Array(2).keys()].map(
                (numero) =>
                    !!(numero === 0 ? aLocations : bLocations).length && (
                        <div key={numero} className="block__row">
                            {[...Array(4).keys()].map(
                                (num) =>
                                    (numero === 0 ? aLocations : bLocations).some(
                                        (number: string) => number >= (num + 1).toString()
                                    ) && (
                                        <div
                                            key={num}
                                            className={`block__cell pattern__${block.pattern} ${
                                                num === 0 && numero === 0 && isDraggable ? 'block__cell--draggable' : ''
                                            }`}
                                            style={{
                                                color: (numero === 0 ? aLocations : bLocations).includes(
                                                    (num + 1).toString()
                                                )
                                                    ? block.colorHex
                                                    : 'rgba(0,0,0,0)'
                                            }}
                                        />
                                    )
                            )}
                        </div>
                    )
            )}
        </div>
    )
}
