import { useDrop } from 'react-dnd'

type Props = {
    children: JSX.Element | JSX.Element[]
}

export default function DropTarget(props: Props) {
    const { children } = props
    const [{ canDrop }, dropRef] = useDrop({
        accept: 'COMPONENT',
        drop: (item) => {
            console.log('mcdick', item)
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
