import { Link } from 'react-router-dom'

export default function Error() {
    return (
        <div className="error">
            <div className="error__message">404</div>
            <Link to="/" className="error__link-lobby">
                go back to lobby &gt;&gt;
            </Link>
        </div>
    )
}
