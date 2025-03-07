"use client"

import { useState, useCallback, useEffect } from 'react'
import { vechain } from '../connection'
import { ConnectionStatus } from '../types'

export function useWallet() {
  const [status, setStatus] = useState<ConnectionStatus>({
    isConnected: false,
    address: null,
    network: 'testnet'
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const handleUpdate = (newStatus: ConnectionStatus) => {
      setStatus(newStatus)
    }
    vechain.onConnect(handleUpdate)
    return () => {
      // Cleanup if needed
    }
  }, [])

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
    isConnected: status.isConnected,
    address: status.address,
    isLoading,
    error
  }
} 