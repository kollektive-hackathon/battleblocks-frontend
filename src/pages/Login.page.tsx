export default function Login() {
    return (
        <div className="login">
            <div className="login__content">
                <div className="login__title">
                    battlebl
                    <div className="white-square" />
                    cks
                </div>
                <div className="login__message">continue?with&gt;</div>
                <div className="login__container">
                    <div className="login__container__app login__container__app--google">
                        <img src="/icons/google.svg" alt="Google login" />
                    </div>
                    <div className="login__container__app login__container__app--apple">
                        <img src="/icons/apple.svg" alt="Apple login" />
                    </div>
                </div>
            </div>
            <div className="login__footer">
                BATTLEBLOCKS is an open-source decentralized application developed by the team of the same name as part
                of the FLOW Hackathon 2023, held from February 21st to 26th. The dApp is not affiliated with any other
                organizations or entities and is provided &quot;as is&quot; without any warranties of any kind, express
                or implied. Your use of the dApp is entirely at your own risk and under your own discretion.
            </div>
        </div>
    )
}
