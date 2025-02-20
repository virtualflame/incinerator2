import Connex from '@vechain/connex'

let connex: Connex | null = null

export const initConnex = () => {
  if (typeof window !== 'undefined' && !connex) {
    const network = process.env.NEXT_PUBLIC_VECHAIN_NETWORK || 'test'
    connex = new Connex({
      node: process.env.NEXT_PUBLIC_VECHAIN_NODE || 'https://testnet.veblocks.net',
      network: network as 'test' | 'main'
    })
  }
  return connex
}

export const getConnex = () => {
  if (!connex) {
    return initConnex()
  }
  return connex
}

// Helper to check if we're on testnet
export const isTestnet = () => {
  return process.env.NEXT_PUBLIC_VECHAIN_NETWORK === 'test'
} 