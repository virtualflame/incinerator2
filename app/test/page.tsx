"use client"

import { useState, useEffect } from 'react'
import { vechain } from '../lib/vechain/connection'
import { ethers } from 'ethers'

export default function TestPage() {
  const [status, setStatus] = useState('')
  const [isConnected, setIsConnected] = useState(false)
  const [balance, setBalance] = useState({
    vet: '0',
    vtho: '0',
    b3tr: '0'
  })

  useEffect(() => {
    // Listen for connection events
    vechain.onConnect(async (status) => {
      setIsConnected(status.isConnected)
      if (status.address) {
        try {
          const bal = await vechain.getBalance(status.address)
          setBalance({
            vet: bal.vet,
            vtho: bal.vtho,
            b3tr: '0'
          })
        } catch (error) {
          console.error('Balance check failed:', error)
        }
      }
    })
  }, [])

  const connectWallet = async () => {
    try {
      setStatus('Connecting to VeWorld...')
      await vechain.connect()
      setStatus('Connected!')
    } catch (error: any) {
      setStatus(`Error: ${error.message}`)
      setIsConnected(false)
    }
  }

  return (
    <div className="p-4 max-w-2xl mx-auto text-black">
      <h1 className="text-2xl font-bold mb-6">VeChain Testnet Environment</h1>
      
      <div className="space-y-6">
        {/* Connection Status */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-2">Connection Status</h2>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
            <span>{isConnected ? 'Connected' : 'Not Connected'}</span>
          </div>
        </div>

        {/* Connect Button */}
        {!isConnected && (
          <button
            className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            onClick={connectWallet}
          >
            Connect VeWorld
          </button>
        )}

        {/* Balances */}
        {isConnected && (
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-semibold mb-3">Wallet Balances</h2>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span>VET:</span>
                <span className="font-mono">{ethers.formatEther(balance.vet)} TEST-VET</span>
              </div>
              <div className="flex justify-between items-center">
                <span>VTHO:</span>
                <span className="font-mono">{ethers.formatEther(balance.vtho)} TEST-VTHO</span>
              </div>
              <div className="flex justify-between items-center">
                <span>B3TR:</span>
                <span className="font-mono">{ethers.formatEther(balance.b3tr)} TEST-B3TR</span>
              </div>
            </div>
          </div>
        )}

        {/* Status Messages */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-2">Status</h2>
          <pre className="bg-gray-50 p-2 rounded text-sm">{status}</pre>
        </div>
      </div>
    </div>
  )
} 