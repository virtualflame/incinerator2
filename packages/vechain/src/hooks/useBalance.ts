import { useState, useEffect } from 'react'
import { vechain } from '../connection'

export function useBalance() {
  const [balances, setBalances] = useState({ vet: '0', vtho: '0', b3tr: '0' })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const address = vechain.getAddress()
    if (!address) return

    const updateBalance = async () => {
      try {
        setIsLoading(true)
        const balance = await vechain.getBalance(address)
        setBalances(balance)
      } catch (err) {
        setError(err as Error)
      } finally {
        setIsLoading(false)
      }
    }

    updateBalance()
  }, [])

  return { balances, isLoading, error }
} 