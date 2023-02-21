const storedUser = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null

export default function App() {
    return <div className="app">battleblocks</div>
}
