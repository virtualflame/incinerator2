import Connex from '@vechain/connex'

const TESTNET_NODE = 'https://testnet.veblocks.net'
const TESTNET_NETWORK = 'test'

let connex: Connex | null = null

export const initConnex = () => {
  if (typeof window === 'undefined') return null
  
  if (!connex) {
    connex = new Connex({
      node: TESTNET_NODE,
      network: TESTNET_NETWORK
    })
  }
  return connex
}

export const getConnex = () => {
  if (typeof window === 'undefined') return null
  return connex || initConnex()
}

export const isTestnet = () => true // Always true for now

// This file looks good, has testnet config ✅ 