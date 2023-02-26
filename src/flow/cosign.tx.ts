import * as fcl from '@onflow/fcl'

const ADDRESS = '0xf95724cf2202cd00'
const KEY_ID = 0

const signingFunction = async (signable: any) => {
    // TODO: change this endpoint when BE is deployed
    const response = await fetch('/cosign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ method: 'purchase_tokens', payload: signable })
    })

    const signature = Buffer.from(await response.json(), 'base64').toString('hex')

    return {
        addr: fcl.withPrefix(ADDRESS),
        keyId: KEY_ID,
        signature
    }
}

const serverAuthorization = (account: any) => ({
    ...account,
    tempId: `${ADDRESS}-${KEY_ID}`,
    addr: fcl.sansPrefix(ADDRESS),
    keyId: KEY_ID,
    signingFunction
})

export const cosign = () =>
    fcl
        .send([
            fcl.transaction`
            transaction {
                let authAccountCap: Capability<&AuthAccount>
                let managerRef: &BattleBlocksAccounts.BattleBlocksAccountManager
                let childRef: &BattleBlocksAccounts.BattleBlocksAccount
                
                prepare(parent: AuthAccount, child: AuthAccount) {
                    if parent.borrow<&BattleBlocksAccounts.BattleBlocksAccountManager>(from: BattleBlocksAccounts.BattleBlocksAccountManagerStoragePath) == nil {
                        parent.save(<-BattleBlocksAccounts.createBattleBlocksAccountManager(), to: BattleBlocksAccounts.BattleBlocksAccountManagerStoragePath)
                    }

                    if !parent.getCapability<&{BattleBlocksAccounts.BattleBlocksAccountManagerPublic}>(BattleBlocksAccounts.BattleBlocksAccountManagerPublicPath).check() {
                        parent.unlink(BattleBlocksAccounts.BattleBlocksAccountManagerPublicPath)
                        parent.link<
                            &{BattleBlocksAccounts.BattleBlocksAccountManagerPublic}
                        >(
                            BattleBlocksAccounts.BattleBlocksAccountManagerPublicPath,
                            target: BattleBlocksAccounts.BattleBlocksAccountManagerStoragePath
                        )
                    }
        
                    self.managerRef = parent
                        .borrow<
                            &BattleBlocksAccounts.BattleBlocksAccountManager
                        >(
                            from: BattleBlocksAccounts.BattleBlocksAccountManagerStoragePath
                        )!

                    if !child.getCapability<&AuthAccount>(BattleBlocksAccounts.AuthAccountCapabilityPath).check() {
                        child.unlink(BattleBlocksAccounts.AuthAccountCapabilityPath)
                        self.authAccountCap = child.linkAccount(BattleBlocksAccounts.AuthAccountCapabilityPath)!
                    } else {
                        self.authAccountCap = child.getCapability<&AuthAccount>(BattleBlocksAccounts.AuthAccountCapabilityPath)
                    }

                    self.childRef = child.borrow<
                        &BattleBlocksAccounts.BattleBlocksAccount
                    >(
                        from: BattleBlocksAccounts.BattleBlocksAccountStoragePath
                    ) ?? panic("Could not borrow reference to BattleBlocksAccountTag in account ".concat(child.address.toString()))

                    if parent.borrow<&BattleBlocksNFT.Collection>(from: BattleBlocksNFT.CollectionStoragePath) != nil {
                        parent.save(<-BattleBlocksNFT.createEmptyCollection(), to: BattleBlocksNFT.CollectionStoragePath)

                        parent.link<
                            &BattleBlocksNFT.Collection{NonFungibleToken.Receiver, NonFungibleToken.CollectionPublic, BattleBlocksNFT.BattleBlocksNFTCollectionPublic}
                        >(
                            BattleBlocksNFT.CollectionPublicPath,
                            target: BattleBlocksNFT.CollectionStoragePath
                        )

                        parent.link<
                            &BattleBlocksNFT.Collection{NonFungibleToken.Provider}
                        >(
                            BattleBlocksNFT.ProviderPrivatePath,
                            target: BattleBlocksNFT.CollectionStoragePath
                        )
                    }
                }
            }
            `,
            fcl.payer(serverAuthorization),
            fcl.proposer(fcl.authz),
            fcl.authorizations([fcl.authz, serverAuthorization]),
            fcl.limit(9999)
        ])
        .then(fcl.decode)
