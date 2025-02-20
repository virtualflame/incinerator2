"use client"

import { useVeChain } from '@/app/hooks/useVeChain'
import { useState } from 'react'
import { isTestnet } from '@/app/lib/vechain/connex'
import { TestnetFaucet } from './TestnetFaucet'
import { TokenBalances } from './TokenBalances'

export function ConnectWallet() {
  const { isConnected, account, walletType, connectWallet } = useVeChain()
  const [isConnecting, setIsConnecting] = useState(false)
  const [showOptions, setShowOptions] = useState(false)

  const handleConnect = async (type: 'veworld' | 'sync2') => {
    setIsConnecting(true)
    try {
      await connectWallet(type)
    } catch (error) {
      console.error('Failed to connect wallet:', error)
    } finally {
      setIsConnecting(false)
      setShowOptions(false)
    }
  }

  if (isConnected) {
    return (
      <div>
        <div className="flex items-center gap-2">
          <span className="px-4 py-2 bg-green-500 text-white rounded-lg">
            Connected to {walletType === 'veworld' ? 'VeWorld' : 'Sync2'}
          </span>
          <span className="text-sm opacity-75">
            {account?.slice(0, 6)}...{account?.slice(-4)}
          </span>
        </div>
        {account && <TokenBalances address={account} />}
        <TestnetFaucet address={account} />
      </div>
    )
  }

  return (
    <div className="relative">
      {isTestnet() && (
        <div className="absolute -top-6 left-0 right-0 text-center text-sm text-yellow-500">
          Testnet Mode
        </div>
      )}
      <button
        onClick={() => setShowOptions(!showOptions)}
        disabled={isConnecting}
        className="px-6 py-2 bg-gradient-to-r from-[#ff6600] to-[#ff9933] text-white rounded-lg 
                 hover:scale-105 transition-transform disabled:opacity-50"
      >
        {isConnecting ? 'Connecting...' : 'Connect Wallet'}
      </button>

      {showOptions && (
        <div className="absolute top-full mt-2 w-full bg-black/90 rounded-lg overflow-hidden">
          <button
            onClick={() => handleConnect('veworld')}
            className="w-full px-4 py-2 text-left hover:bg-[#ff6600]/20 transition-colors"
          >
            VeWorld
          </button>
          <button
            onClick={() => handleConnect('sync2')}
            className="w-full px-4 py-2 text-left hover:bg-[#ff6600]/20 transition-colors"
          >
            Sync2
          </button>
        </div>
      )}
      <TestnetFaucet />
    </div>
  )
} 