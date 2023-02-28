import { useDrop } from 'react-dnd'

type Props = {
    children: JSX.Element | JSX.Element[]
    onDrop: () => void
}

export default function DropTarget(props: Props) {
    const { children, onDrop } = props
    const [{ canDrop }, dropRef] = useDrop({
        accept: 'COMPONENT',
        drop: () => {
            onDrop()
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
