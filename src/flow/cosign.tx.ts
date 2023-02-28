import * as fcl from '@onflow/fcl'
import axios from 'axios'

const KEY_ID = 0

const signingFunction = async (signable: any, battleBlocksWallet: string) => {
    // TODO: catch possible error
    const { data } = await axios.post(`/cosign`, { payload: signable })

    const signature = Buffer.from(data, 'base64').toString('hex')

    return {
        addr: fcl.withPrefix(battleBlocksWallet),
        keyId: KEY_ID,
        signature
    }
}

const serverAuthorization = (account: any, battleBlocksWallet: string) => ({
    ...account,
    tempId: `${battleBlocksWallet}-${KEY_ID}`,
    addr: fcl.sansPrefix(battleBlocksWallet),
    keyId: KEY_ID,
    signingFunction: (signable: any) => signingFunction(signable, battleBlocksWallet)
})

export const cosign = async (battleBlocksWallet: string | null) => {
    const tx = await fcl
        .send([
            fcl.transaction`
import BattleBlocksAccounts from 0xBATTLE_BLOCKS_ADDRESS
import BattleBlocksNFT from 0xBATTLE_BLOCKS_ADDRESS
import FungibleToken from 0xFUNGIBLE_TOKEN_ADDRESS
import NonFungibleToken from 0xNON_FUNGIBLE_TOKEN_ADDRESS

transaction {

    let authAccountCap: Capability<&AuthAccount>
    let managerRef: &BattleBlocksAccounts.BattleBlocksAccountManager
    let childRef: &BattleBlocksAccounts.BattleBlocksAccount

    prepare(parent: AuthAccount, child: AuthAccount) {

        /* --- Configure parent's BattleBlocksAccountManager --- */
        //
        // Get BattleBlocksAccountManager Capability, linking if necessary
        if parent.borrow<&BattleBlocksAccounts.BattleBlocksAccountManager>(from: BattleBlocksAccounts.BattleBlocksAccountManagerStoragePath) == nil {
            // Save
            parent.save(<-BattleBlocksAccounts.createBattleBlocksAccountManager(), to: BattleBlocksAccounts.BattleBlocksAccountManagerStoragePath)
        }
        // Ensure BattleBlocksAccountManagerPublic is linked properly
        if !parent.getCapability<&{BattleBlocksAccounts.BattleBlocksAccountManagerPublic}>(BattleBlocksAccounts.BattleBlocksAccountManagerPublicPath).check() {
            parent.unlink(BattleBlocksAccounts.BattleBlocksAccountManagerPublicPath)
            // Link
            parent.link<
                &{BattleBlocksAccounts.BattleBlocksAccountManagerPublic}
            >(
                BattleBlocksAccounts.BattleBlocksAccountManagerPublicPath,
                target: BattleBlocksAccounts.BattleBlocksAccountManagerStoragePath
            )
        }
        // Get a reference to the BattleBlocksAccountManager resource
        self.managerRef = parent
            .borrow<
                &BattleBlocksAccounts.BattleBlocksAccountManager
            >(
                from: BattleBlocksAccounts.BattleBlocksAccountManagerStoragePath
            )!

        /* --- Link the child account's AuthAccount Capability & assign --- */
        //
        // Get the AuthAccount Capability, linking if necessary
        if !child.getCapability<&AuthAccount>(BattleBlocksAccounts.AuthAccountCapabilityPath).check() {
            // Unlink any Capability that may be there
            child.unlink(BattleBlocksAccounts.AuthAccountCapabilityPath)
            // Link & assign the AuthAccount Capability
            self.authAccountCap = child.linkAccount(BattleBlocksAccounts.AuthAccountCapabilityPath)!
        } else {
            // Assign the AuthAccount Capability
            self.authAccountCap = child.getCapability<&AuthAccount>(BattleBlocksAccounts.AuthAccountCapabilityPath)
        }

        // Get a refernce to the child account
        self.childRef = child.borrow<
                &BattleBlocksAccounts.BattleBlocksAccount
            >(
                from: BattleBlocksAccounts.BattleBlocksAccountStoragePath
            ) ?? panic("Could not borrow reference to BattleBlocksAccountTag in account ".concat(child.address.toString()))


        /* --- Set up BattleBlocksNFT.Collection --- */
        //
        if parent.borrow<&BattleBlocksNFT.Collection>(from: BattleBlocksNFT.CollectionStoragePath) != nil {
            // Create & save it to the account
            parent.save(<-BattleBlocksNFT.createEmptyCollection(), to: BattleBlocksNFT.CollectionStoragePath)

            // Create a public capability for the collection
            parent.link<
                &BattleBlocksNFT.Collection{NonFungibleToken.Receiver, NonFungibleToken.CollectionPublic, BattleBlocksNFT.BattleBlocksNFTCollectionPublic}
                >(
                    BattleBlocksNFT.CollectionPublicPath,
                    target: BattleBlocksNFT.CollectionStoragePath
                )

            // Link the Provider Capability in private storage
            parent.link<
                &BattleBlocksNFT.Collection{NonFungibleToken.Provider}
                >(
                    BattleBlocksNFT.ProviderPrivatePath,
                    target: BattleBlocksNFT.CollectionStoragePath
                )
        }
    }

    execute {
        // Add child account if it's parent-child accounts aren't already linked
        let childAddress = self.authAccountCap.borrow()!.address
        if !self.managerRef.getBattleBlocksAccountAddresses().contains(childAddress) {
            // Add the child account
            self.managerRef.addAsBattleBlocksAccount(battleBlocksAccountCap: self.authAccountCap, battleBlocksAccount: self.childRef)
        }
    }
}
            `,
            fcl.payer((account: any) => serverAuthorization(account, battleBlocksWallet!)),
            fcl.proposer(fcl.authz),
            fcl.authorizations([fcl.authz, (account: any) => serverAuthorization(account, battleBlocksWallet!)]),
            fcl.limit(9999)
        ])
        .then(fcl.decode)

    return fcl.tx(tx).onceSealed()
}
