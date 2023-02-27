import { config } from '@onflow/fcl'

import {
    BATTLE_BLOCKS_ADDRESS,
    FLOW_ACCESS_NODE,
    FLOW_DISCOVERY_WALLET,
    FLOW_TOKEN_ADDRESS,
    FUNGIBLE_TOKEN_ADDRESS,
    NON_FUNGIBLE_TOKEN_ADDRESS
} from '@/config/variables'

config()
    .put('env', 'testnet')
    .put('accessNode.api', FLOW_ACCESS_NODE)
    .put('discovery.wallet', FLOW_DISCOVERY_WALLET)
    .put('discovery.wallet.method', 'HTTP/POST')
    .put('0xFLOW_TOKEN_ADDRESS', FLOW_TOKEN_ADDRESS)
    .put('0xFUNGIBLE_TOKEN_ADDRESS', FUNGIBLE_TOKEN_ADDRESS)
    .put('0xNON_FUNGIBLE_TOKEN_ADDRESS', NON_FUNGIBLE_TOKEN_ADDRESS)
    .put('0xBATTLE_BLOCKS_ADDRESS', BATTLE_BLOCKS_ADDRESS)
