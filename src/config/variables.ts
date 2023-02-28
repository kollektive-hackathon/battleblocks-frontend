// we know this shouldn't be here hardcoded, but BE doesn't set env variables, so...
export const API_URL = process.env.API_URL ?? 'https://battleblocks.lol/api'

export const GOOGLE_AUTH_CLIENT_ID =
    process.env.GOOGLE_AUTH_CLIENT_ID ?? '80881299977-lsoime6se02ich5l3f9sgenm22c7mcmi.apps.googleusercontent.com'
export const PAYPAL_CLIENT_ID =
    process.env.PAYPAL_CLIENT_ID ?? 'ARRT0F4SWvvfZcbZuSayEpUxVyC6dam-KsC5qvudmLwlPQ8XPaMXvBzW-0sfreHifBX0TzptZx4cSloi'
export const FLOW_ACCESS_NODE = process.env.FLOW_ACCESS_NODE ?? 'https://access-testnet.onflow.org'
export const FLOW_DISCOVERY_WALLET =
    process.env.FLOW_DISCOVERY_WALLET ?? 'https://flow-wallet-testnet.blocto.app/api/flow/authn'
export const FLOW_TOKEN_ADDRESS = process.env.FLOW_TOKEN_ADDRESS ?? '0x7e60df042a9c0868'
export const FUNGIBLE_TOKEN_ADDRESS = process.env.FUNGIBLE_TOKEN_ADDRESS ?? '0x9a0766d93b6608b7'
export const NON_FUNGIBLE_TOKEN_ADDRESS = process.env.NON_FUNGIBLE_TOKEN_ADDRESS ?? '0x631e88ae7f1d7c20'
export const BATTLE_BLOCKS_ADDRESS = process.env.BATTLE_BLOCKS_ADDRESS ?? '0xf95724cf2202cd00'
