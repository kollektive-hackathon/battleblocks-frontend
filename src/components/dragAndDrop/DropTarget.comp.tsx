import { useDrop } from 'react-dnd'

type Props = {
    children: JSX.Element | JSX.Element[]
    onDrop: (x: number, y: number, blockId: number) => void
    x: number
    y: number
}

export default function DropTarget(props: Props) {
    const { children, onDrop, x, y } = props
    const [{ canDrop }, dropRef] = useDrop({
        accept: 'COMPONENT',
        drop: (item) => {
            onDrop(x, y, (item as any).data)
        },
        collect: (monitor) => ({
            canDrop: monitor.canDrop()
        })
    })

    return (
        <div ref={dropRef} style={{ backgroundColor: canDrop ? 'green' : 'white' }}>
            {children}
        </div>
    )
}
