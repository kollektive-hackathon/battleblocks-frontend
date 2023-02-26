import { config } from '@onflow/fcl'

config()
    .put('env', 'testnet')
    .put('accessNode.api', process.env.FLOW_ACCESS_NODE)
    .put('discovery.wallet', process.env.FLOW_DISCOVERY_WALLET)
    .put('discovery.wallet.method', 'HTTP/POST')
    .put('0xFLOW_TOKEN_ADDRESS', process.env.FLOW_TOKEN_ADDRESS)
    .put('0xFUNGIBLE_TOKEN_ADDRESS', process.env.NON_FUNGIBLE_TOKEN_ADDRESS)
    .put('0xNON_FUNGIBLE_TOKEN_ADDRESS', process.env.FUNGIBLE_TOKEN_ADDRESS)
    .put('0xBATTLE_BLOCKS_ADDRESS', process.env.BATTLE_BLOCKS_ADDRESS)
