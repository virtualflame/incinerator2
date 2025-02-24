// Basic types we'll need
export type VeChainNetwork = 'mainnet' | 'testnet'

export type ConnectionStatus = {
  isConnected: boolean
  address: string | null
  network: VeChainNetwork
} 