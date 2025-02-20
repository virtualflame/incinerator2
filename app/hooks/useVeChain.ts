import { useState, useEffect } from 'react'
import { getConnex } from '@/lib/vechain/connex'

type WalletType = 'veworld' | 'sync2' | null

export function useVeChain() {
  const [isConnected, setIsConnected] = useState(false)
  const [account, setAccount] = useState<string | null>(null)
  const [walletType, setWalletType] = useState<WalletType>(null)

  const connectWallet = async (type: WalletType) => {
    const connex = getConnex()
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

  return { isConnected, account, walletType, connectWallet }
} 