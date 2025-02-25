// Declare global VeChain types
declare global {
  interface Window {
    connex: any;
    ethers: any;
    vechain: any;
    thor: any;        // Sync2 wallet
  }
}

// Our app's network types
export type VeChainNetwork = 'mainnet' | 'testnet'

// Connection status type
export interface ConnectionStatus {
  isConnected: boolean
  address: string | null
  network: 'testnet'  // We only use testnet
}

// Add collection types
export interface NFTCollection {
  address: string
  name: string
  symbol: string
  totalSupply: number
}

// Make this a module
export {} 