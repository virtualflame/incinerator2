import Connex from '@vechain/connex'

let connex: Connex | null = null

const TESTNET_NODE = 'https://testnet.veblocks.net'
const TESTNET_NETWORK = 'test'

export const initConnex = () => {
  // Only initialize on client side
  if (typeof window === 'undefined') return null

  if (!connex) {
    const network = process.env.NEXT_PUBLIC_VECHAIN_NETWORK || 'test'
    connex = new Connex({
      node: process.env.NEXT_PUBLIC_VECHAIN_NODE || 'https://testnet.veblocks.net',
      network: network as 'test' | 'main'
    })
  }
  return connex
}

export const getConnex = () => {
  // Only run on client side
  if (typeof window === 'undefined') return null
  
  if (!connex) {
    return initConnex()
  }
  return connex
}

// Helper to check if we're on testnet
export const isTestnet = () => {
  return process.env.NEXT_PUBLIC_VECHAIN_NETWORK === 'test'
}

// This file looks good, has testnet config ✅ 