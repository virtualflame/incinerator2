// Declare global VeChain types
declare global {
  interface Window {
    Connex: any;      // VeChain Connex
    vechain: any;     // VeWorld wallet
    thor: any;        // Sync2 wallet
  }
}

// Our app's network types
export type VeChainNetwork = 'mainnet' | 'testnet'

// Connection status type
export type ConnectionStatus = {
  isConnected: boolean
  address: string | null
  network: VeChainNetwork
}

// Make this a module
export {} 