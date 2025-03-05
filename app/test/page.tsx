"use client"

import { useState, useEffect } from 'react'
import { vechain } from '../lib/vechain/connection'
import { ethers } from 'ethers'

export default function TestPage() {
  const [status, setStatus] = useState('Not Connected')
  const [isConnected, setIsConnected] = useState(false)
  const [balance, setBalance] = useState({
    vet: '0',
    vtho: '0',
    b3tr: '0'
  })

  const updateBalance = async () => {
    const address = vechain.getAddress()
    if (!address) return

    try {
      const bal = await vechain.getBalance(address)
      console.log('Balance updated:', bal) // Debug log
      setBalance(bal)
    } catch (error) {
      console.error('Balance update failed:', error)
    }
  }

  useEffect(() => {
    // Check initial connection
    const isConnected = vechain.isConnected()
    setIsConnected(isConnected)
    if (isConnected) {
      updateBalance()
    }

    // Listen for connection changes
    vechain.onConnect((status) => {
      console.log('Connection status:', status) // Debug log
      setIsConnected(status.isConnected)
      if (status.isConnected) {
        setStatus('Connected!')
        updateBalance()
      } else {
        setStatus('Not Connected')
      }
    })
  }, [])

  const connectWallet = async () => {
    try {
      setStatus('Connecting to VeWorld...')
      const status = await vechain.connect()
      console.log('Connected:', status) // Debug log
      setIsConnected(true)
      setStatus('Connected!')
      await updateBalance()
    } catch (error: any) {
      console.error('Connection error:', error)
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
            <span>{status}</span>
          </div>
        </div>

        {/* Connect Button */}
        {!isConnected && (
          <button
            onClick={connectWallet}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
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
                <span className="font-mono">{ethers.formatEther(balance.vet)} VET</span>
              </div>
              <div className="flex justify-between items-center">
                <span>VTHO:</span>
                <span className="font-mono">{ethers.formatEther(balance.vtho)} VTHO</span>
              </div>
              <div className="flex justify-between items-center">
                <span>B3TR:</span>
                <span className="font-mono">{ethers.formatEther(balance.b3tr)} B3TR</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 