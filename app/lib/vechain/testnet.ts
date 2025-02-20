export const TESTNET_RESOURCES = {
  faucet: 'https://faucet.vecha.in',
  explorer: 'https://explore-testnet.vechain.org',
  node: 'https://testnet.veblocks.net',
  documentation: 'https://docs.vechain.org/thor/get-started/network.html#testnet'
}

export const getTestnetHelp = () => {
  return {
    getFaucetLink: () => TESTNET_RESOURCES.faucet,
    getExplorerLink: (address: string) => `${TESTNET_RESOURCES.explorer}/accounts/${address}`,
    getTransactionLink: (txId: string) => `${TESTNET_RESOURCES.explorer}/transactions/${txId}`
  }
} 