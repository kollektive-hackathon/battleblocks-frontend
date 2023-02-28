import { useDrag } from 'react-dnd'

type Props = {
    children: JSX.Element | JSX.Element[]
}

export default function DraggableComponent(props: Props) {
    const { children } = props
    const [{ isDragging }, dragRef] = useDrag({
        type: 'COMPONENT',
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
