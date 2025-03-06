import { useCallback, useState } from 'react'
import { vechain } from '../connection'

export function useWallet() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const connect = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const status = await vechain.connect()
      return status
    } catch (err) {
      const error = err as Error
      setError(error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    connect,
    isConnected: vechain.isConnected(),
    address: vechain.getAddress(),
    disconnect: vechain.disconnect,
    isLoading,
    error
  }
} 