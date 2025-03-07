"use client"

import { useWallet } from '@incinerator/vechain'
import { LoadingSpinner } from './LoadingSpinner'

export function WalletConnect() {
  const { connect, disconnect, isConnected, address, isLoading, error } = useWallet()

  return (
    <div className="space-y-4">
      {isLoading && <LoadingSpinner />}
      
      {error && (
        <div className="text-red-500">
          {error.message}
        </div>
      )}

      {!isConnected ? (
        <button
          onClick={connect}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          Connect Wallet
        </button>
      ) : (
        <div className="space-y-2">
          <p>Connected: {address}</p>
          <button
            onClick={disconnect}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Disconnect
          </button>
        </div>
      )}
    </div>
  )
} 