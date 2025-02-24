// VeChain testnet configuration
export const TESTNET_CONFIG = {
  node: 'https://testnet.veblocks.net',
  network: 'test',
  genesisID: '0x00000000851caf3cfdb6e899cf5958bfb1ac3413d346d43539627e6be7ec1b4a'
}

// Check if we're on testnet
export const isTestnet = () => {
  return process.env.NEXT_PUBLIC_VECHAIN_NETWORK === 'testnet'
}

// Initialize Connex for testnet
export const initTestnet = () => {
  if (typeof window === 'undefined') return null
  
  try {
    const connex = new window.Connex({
      node: TESTNET_CONFIG.node,
      network: TESTNET_CONFIG.network,
      genesisId: TESTNET_CONFIG.genesisID
    })
    return connex
  } catch (error) {
    console.error('Failed to initialize testnet:', error)
    return null
  }
} 