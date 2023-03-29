import { useDrop } from 'react-dnd'

type Props = {
    children: JSX.Element | JSX.Element[]
    onDrop: (x: number, y: number, blockId: number) => void
    x: number
    y: number
}

export default function DropTarget({ children, onDrop, x, y }: Props) {
    const [, dropRef] = useDrop({
        accept: 'COMPONENT',
        drop: (item) => {
            onDrop(x, y, (item as any).data)
        }
    })

    return <div ref={dropRef}>{children}</div>
}
