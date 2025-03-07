import { useState, useCallback } from 'react'
import { vechain } from '../connection'
import { ConnectionStatus } from '../types'

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
    disconnect: vechain.disconnect.bind(vechain),
    isConnected: vechain.isConnected(),
    address: vechain.getAddress(),
    isLoading,
    error
  }
} 