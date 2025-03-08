"use client"

import { useWallet, useNetwork, useBalance } from '@incinerator/vechain'
import { LoadingSpinner } from './LoadingSpinner'

export function WalletConnect() {
  const { connect, disconnect, isConnected, address, isLoading, error } = useWallet()
  const { isTestnet } = useNetwork()
  const { balances } = useBalance()

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600">{error.message}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Refresh Page
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Network Status */}
      <div className="flex items-center space-x-2">
        <div className={`h-3 w-3 rounded-full ${isTestnet ? 'bg-orange-400' : 'bg-green-400'}`} />
        <span className="text-sm text-gray-600">
          {isTestnet ? 'Testnet' : 'Mainnet'}
        </span>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={connect}
          disabled={isLoading || isConnected}
          className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 disabled:opacity-50 font-medium"
        >
          {isLoading ? (
            <div className="flex items-center justify-center space-x-2">
              <LoadingSpinner />
              <span>Connecting...</span>
            </div>
          ) : (
            'Connect Wallet'
          )}
        </button>

        <button
          className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 disabled:opacity-50 font-medium"
          disabled={!isConnected}
        >
          Burn NFT
        </button>

        <button
          className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 disabled:opacity-50 font-medium"
          disabled={!isConnected}
        >
          Mint NFT
        </button>

        <button
          className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 disabled:opacity-50 font-medium"
          disabled={!isConnected}
        >
          View NFTs
        </button>
      </div>

      {/* Wallet Info */}
      {isConnected && (
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Connected Address</p>
            <p className="font-mono text-sm">{address}</p>
          </div>

          {/* Balances */}
          <div className="grid grid-cols-3 gap-4">
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500 mb-1">VET</p>
              <p className="font-medium">{balances.vet}</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500 mb-1">VTHO</p>
              <p className="font-medium">{balances.vtho}</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500 mb-1">B3TR</p>
              <p className="font-medium">{balances.b3tr}</p>
            </div>
          </div>

          <button
            onClick={disconnect}
            className="w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 font-medium"
          >
            Disconnect
          </button>
        </div>
      )}
    </div>
  )
} 