import { config } from '@onflow/fcl'

config()
    .put('env', 'testnet')
    .put('accessNode.api', 'https://access-testnet.onflow.org')
    .put('discovery.wallet', 'https://flow-wallet-testnet.blocto.app/api/flow/authn')
    .put('discovery.wallet.method', 'HTTP/POST')
    .put('0xFLOW_TOKEN_ADDRESS', '0x7e60df042a9c0868')
    .put('0xFUNGIBLE_TOKEN_ADDRESS', '0x9a0766d93b6608b7')
