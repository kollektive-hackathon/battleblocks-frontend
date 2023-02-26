import { config } from '@onflow/fcl'

config()
    .put('env', 'testnet')
    .put('accessNode.api', 'https://access-testnet.onflow.org')
    .put('discovery.wallet', 'https://flow-wallet-testnet.blocto.app/api/flow/authn')
    .put('discovery.wallet.method', 'HTTP/POST')
