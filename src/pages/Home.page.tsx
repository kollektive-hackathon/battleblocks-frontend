import { Outlet } from 'react-router-dom'

export default function Home() {
    return (
        <div className="home">
            <div className="logo">
                battle <br /> bl
                <div className="white-square white-square--small" />
                cks
            </div>
            <Outlet />
        </div>
    )
}
