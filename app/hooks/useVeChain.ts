"use client"

import { useState } from 'react'
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
      if (type) {
        sessionStorage.setItem('walletType', type)
      }
    } catch (error) {
      console.error('Wallet connection error:', error)
      setIsConnected(false)
    }
  }

  return { isConnected, account, walletType, connectWallet }
}