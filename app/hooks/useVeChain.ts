"use client"

import { useState, useEffect } from 'react'
import { getConnex } from '../lib/vechain'
import { useContext } from 'react'
import { Web3Context } from '../components/web3/Web3Provider'

type WalletType = 'veworld' | 'sync2' | null

export function useVeChain() {
  const { connex } = useContext(Web3Context)
  const [isConnected, setIsConnected] = useState(false)
  const [account, setAccount] = useState<string | null>(null)
  const [walletType, setWalletType] = useState<WalletType>(null)

  const connectWallet = async (type: WalletType) => {
    if (!connex) return

    try {
      const vendor = await connex.vendor.sign('cert', {
        purpose: 'identification',
        payload: {
          type: 'text',
          content: 'Connect to VFS Incinerator'
        }
      })
      setAccount(vendor.annex.signer)
      setIsConnected(true)
      setWalletType(type)
      sessionStorage.setItem('walletType', type)
    } catch (error) {
      console.error('Wallet connection error:', error)
      setIsConnected(false)
    }
  }

  const checkNetwork = async () => {
    if (!connex) return false
    
    const genesis = await connex.thor.genesis()
    return genesis.id === '0x000000000b2bce3c70bc649a02749e8687721b09ed2e15997f466536b20bb127' // Testnet genesis
  }

  return { isConnected, account, walletType, connectWallet }
} 