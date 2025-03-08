"use client"

import { useWallet, useNetwork, useBalance } from '@incinerator/vechain'
import { LoadingSpinner } from './LoadingSpinner'

export function WalletConnect() {
  const { connect, disconnect, isConnected, address, isLoading, error } = useWallet()
  const { isTestnet } = useNetwork()
  const { balances } = useBalance()

  if (error) {
    return (
      <div className="p-4 border-2 border-red-500 bg-gradient-to-b from-red-100 to-red-200 rounded-lg shadow-inner">
        <p className="text-red-600 font-bold">{error.message}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-2 bg-gradient-to-b from-red-500 to-red-600 text-white px-6 py-2 rounded border-b-4 border-red-700 hover:from-red-600 hover:to-red-700 active:border-b-0 active:mt-3 transition-all"
        >
          Refresh Page
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6 bg-gradient-to-b from-orange-50 to-orange-100 rounded-lg border-2 border-orange-200 shadow-lg">
      {/* Network Status - Retro Style */}
      <div className="flex items-center space-x-2 bg-gradient-to-r from-orange-200 to-orange-300 p-2 rounded-lg border border-orange-400">
        <div className={`h-3 w-3 rounded-full ${isTestnet ? 'animate-pulse bg-gradient-to-r from-orange-400 to-red-500' : 'bg-gradient-to-r from-green-400 to-green-500'}`} />
        <span className="text-sm font-bold text-orange-800">
          {isTestnet ? 'Testnet Flame' : 'Mainnet Inferno'}
        </span>
      </div>

      {/* Action Buttons - Retro Grid */}
      <div className="grid grid-cols-2 gap-4">
        {!isConnected ? (
          <button
            onClick={connect}
            disabled={isLoading}
            className="col-span-2 px-4 py-2 bg-gradient-to-b from-orange-500 to-orange-600 text-white rounded border-b-4 border-orange-700 hover:from-orange-600 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed active:border-b-0 active:mt-1 transition-all font-bold shadow-md"
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <LoadingSpinner />
                <span>Igniting...</span>
              </div>
            ) : (
              'Connect Wallet'
            )}
          </button>
        ) : (
          <>
            <button
              className="col-span-2 px-6 py-3 bg-gradient-to-b from-red-500 to-red-600 text-white rounded border-b-4 border-red-700 hover:from-red-600 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed active:border-b-0 active:mt-1 transition-all font-bold text-lg shadow-lg"
              disabled={!isConnected}
            >
              🔥 BURN NFT 🔥
            </button>

            <button
              className="px-4 py-2 bg-gradient-to-b from-blue-500 to-blue-600 text-white rounded border-b-4 border-blue-700 hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed active:border-b-0 active:mt-1 transition-all font-bold shadow-md"
              disabled={!isConnected}
            >
              👁 View NFTs
            </button>

            <button
              onClick={disconnect}
              className="px-4 py-2 bg-gradient-to-b from-gray-500 to-gray-600 text-white rounded border-b-4 border-gray-700 hover:from-gray-600 hover:to-gray-700 font-bold active:border-b-0 active:mt-1 transition-all shadow-md"
            >
              Disconnect
            </button>
          </>
        )}
      </div>

      {/* Wallet Info - Retro Card */}
      {isConnected && (
        <div className="space-y-4">
          <div className="p-4 bg-gradient-to-b from-gray-100 to-gray-200 rounded-lg border-2 border-orange-200 shadow-inner">
            <p className="text-sm text-orange-800 font-bold mb-1">Connected Address</p>
            <p className="font-mono text-sm bg-white px-3 py-1 rounded border border-orange-200">{address}</p>
          </div>

          {/* Balances - Retro Style */}
          <div className="grid grid-cols-3 gap-4">
            <div className="p-3 bg-gradient-to-b from-yellow-100 to-orange-100 rounded-lg border-2 border-orange-200 shadow-inner">
              <p className="text-xs text-orange-800 font-bold mb-1">VET</p>
              <p className="font-bold font-mono">{balances.vet}</p>
            </div>
            <div className="p-3 bg-gradient-to-b from-yellow-100 to-orange-100 rounded-lg border-2 border-orange-200 shadow-inner">
              <p className="text-xs text-orange-800 font-bold mb-1">VTHO</p>
              <p className="font-bold font-mono">{balances.vtho}</p>
            </div>
            <div className="p-3 bg-gradient-to-b from-yellow-100 to-orange-100 rounded-lg border-2 border-orange-200 shadow-inner">
              <p className="text-xs text-orange-800 font-bold mb-1">B3TR</p>
              <p className="font-bold font-mono">{balances.b3tr}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 