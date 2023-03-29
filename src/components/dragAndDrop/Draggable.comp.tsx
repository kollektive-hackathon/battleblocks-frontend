import { useDrag } from 'react-dnd'

type Props = {
    children: JSX.Element | JSX.Element[]
    blockId: number
}

export default function DraggableComponent({ children, blockId }: Props) {
    const [{ isDragging }, dragRef] = useDrag({
        type: 'COMPONENT',
        item: { data: blockId },
        collect: (monitor) => ({
            isDragging: monitor.isDragging()
        })
    })

    return (
        <div ref={dragRef} className="draggable-component" style={{ opacity: isDragging ? 0.5 : 1 }}>
            {children}
        </div>
    )
}
