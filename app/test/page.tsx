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
    b3tr: '0'  // Add B3TR balance
  })

  // Status dot component with black text
  const StatusDot = ({ connected }: { connected: boolean }) => (
    <div className="flex items-center gap-2 text-black">
      <div className={`w-3 h-3 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`} />
      <span>{connected ? 'Connected' : 'Not Connected'}</span>
    </div>
  )

  // Add wallet detection effect
  useEffect(() => {
    const checkWallet = () => {
      const hasWallet = vechain.isWalletAvailable()
      if (hasWallet) {
        setStatus('VeWorld detected. Click connect to continue.')
      } else {
        setStatus('Waiting for VeWorld...')
      }
    }

    // Check immediately
    checkWallet()

    // Listen for vechain injection
    window.addEventListener('vechain', checkWallet)

    return () => {
      window.removeEventListener('vechain', checkWallet)
    }
  }, [])

  const connectWallet = async () => {
    try {
      setStatus('Connecting to VeWorld...')
      
      if (!vechain.isWalletAvailable()) {
        setStatus('VeWorld wallet not found. Please install the extension and refresh.')
        return
      }

      const status = await vechain.connect()
      
      if (status.isConnected && status.address) {
        setIsConnected(true)
        setStatus('Connected to testnet!')
        
        try {
          const bal = await vechain.getBalance(status.address)
          setBalance({
            vet: bal.vet,
            vtho: bal.vtho,
            b3tr: '0'
          })
        } catch (error) {
          console.log('Balance check failed:', error)
        }
      } else {
        setStatus('Connection failed')
      }
    } catch (error: any) {
      console.error('Connection error:', error)
      setStatus(`Error: ${error.message || 'Failed to connect to VeWorld'}`)
      setIsConnected(false)
    }
  }

  return (
    <div className="p-4 max-w-2xl mx-auto text-black">
      <h1 className="text-2xl font-bold mb-6 text-black">VeChain Testnet Environment</h1>
      
      <div className="space-y-6">
        {/* Connection Status */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-2 text-black">Connection Status</h2>
          <StatusDot connected={isConnected} />
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
            <h2 className="text-lg font-semibold mb-3 text-black">Wallet Balances</h2>
            <div className="space-y-2 text-black">
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
          <h2 className="text-lg font-semibold mb-2 text-black">Status</h2>
          <pre className="bg-gray-50 p-2 rounded text-sm text-black">{status}</pre>
        </div>
      </div>
    </div>
  )
} 