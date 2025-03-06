import { useState, useEffect } from 'react'
import { vechain } from '../connection'
import { useWallet } from './useWallet'

export function useBalance() {
  const { address, isConnected } = useWallet()
  const [balances, setBalances] = useState({ vet: '0', vtho: '0', b3tr: '0' })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  async function fetchBalances() {
    if (!address) return
    setIsLoading(true)
    try {
      const result = await vechain.getBalance(address)
      setBalances(result)
      setError(null)
    } catch (err) {
      setError(err as Error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (isConnected && address) {
      fetchBalances()
    }
  }, [address, isConnected])

  return {
    balances,
    isLoading,
    error,
    refetch: fetchBalances
  }
} 