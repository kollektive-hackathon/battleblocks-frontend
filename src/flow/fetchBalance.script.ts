import { arg, args, cdc, decode, script, send } from '@onflow/fcl'
// @ts-ignore
import { Address } from '@onflow/types'

const CODE = cdc`
import FungibleToken from 0xFUNGIBLE_TOKEN_ADDRESS
import FlowToken from 0xFLOW_TOKEN_ADDRESS

pub fun main(account: Address): UFix64 {

    let vaultRef = getAccount(account)
        .getCapability(/public/flowTokenBalance)
        .borrow<&FlowToken.Vault{FungibleToken.Balance}>()
        ?? panic("Could not borrow Balance reference to the Vault")

    return vaultRef.balance
}
`

export async function fetchBalance(address: string) {
    if (!address) {
        return 0
    }

    try {
        return +(await send([script(CODE), args([arg(address, Address)])]).then(decode)) ?? 0
    } catch (e) {
        return 0
    }
}
