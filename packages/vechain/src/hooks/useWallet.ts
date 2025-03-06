import { useCallback } from 'react'
import { vechain } from '../connection'

export function useWallet() {
  const connect = useCallback(async () => {
    try {
      const status = await vechain.connect()
      return status
    } catch (error) {
      console.error('Wallet connection failed:', error)
      throw error
    }
  }, [])

  return {
    connect,
    isConnected: vechain.isConnected(),
    address: vechain.getAddress(),
    disconnect: vechain.disconnect
  }
} 