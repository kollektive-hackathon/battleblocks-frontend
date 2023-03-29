interface Props {
    dark?: boolean
}

export default function Loader({ dark }: Props) {
    return <div className={`loader${dark ? ' loader--dark' : ''}`} />
}
