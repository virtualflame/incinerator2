// Export all vechain utilities
export * from './connex'
export * from './contracts'
export * from './testnet'

// Export constants
export const TESTNET_CONFIG = {
  node: 'https://testnet.veblocks.net',
  network: 'test'
} as const 