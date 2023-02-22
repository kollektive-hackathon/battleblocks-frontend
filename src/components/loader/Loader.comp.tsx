interface Props {
    dark?: boolean
}

export default function Loader(props: Props) {
    const { dark } = props

    return <div className={`loader${dark ? ' loader--dark' : ''}`} />
}
