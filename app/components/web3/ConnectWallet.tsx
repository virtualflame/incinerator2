"use client"

import { useState } from 'react'
import { useVeChain } from '../../hooks/useVeChain'
import { isTestnet } from '../../lib/vechain'
import { TestnetFaucet } from './TestnetFaucet'
import { TokenBalances } from './TokenBalances'

export function ConnectWallet() {
  const { isConnected, account, walletType, connectWallet } = useVeChain()
  const [isConnecting, setIsConnecting] = useState(false)
  const [showOptions, setShowOptions] = useState(false)

  // ... rest of the component code
}