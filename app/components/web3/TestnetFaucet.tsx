"use client"

import { TESTNET_RESOURCES } from '../../lib/vechain/testnet'
import { isTestnet } from '../../lib/vechain/connex'

export function TestnetFaucet({ address }: { address?: string | null }) {
  if (!isTestnet()) return null

  return (
    <div className="text-center mt-2 p-4 bg-black/20 rounded-lg">
      <h3 className="text-yellow-500 mb-2">Testnet Mode</h3>
      <p className="text-sm mb-2">Need test tokens?</p>
      <a
        href={TESTNET_RESOURCES.faucet}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block px-4 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 
                  text-white rounded hover:scale-105 transition-transform text-sm"
      >
        Get Testnet Tokens
      </a>
      {address && (
        <div className="mt-2 text-xs text-gray-400">
          <p>Your address to copy:</p>
          <code className="bg-black/40 px-2 py-1 rounded">{address}</code>
        </div>
      )}
    </div>
  )
} 