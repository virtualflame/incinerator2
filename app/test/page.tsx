"use client"

import { useState } from 'react'
import { vechain } from '../lib/vechain/connection'

export default function TestPage() {
  const [status, setStatus] = useState('')
  const [isConnected, setIsConnected] = useState(false)
  const [balance, setBalance] = useState({ vet: '0', vtho: '0' })

  const connectWallet = async () => {
    try {
      setStatus('Connecting to VeWorld...')
      const status = await vechain.connect()
      
      if (status.isConnected && status.address) {
        setIsConnected(true)
        setStatus('Connected to testnet!')
        
        // Get balance after successful connection
        try {
          const bal = await vechain.getBalance(status.address)
          setBalance(bal)
        } catch (error) {
          console.log('Balance check failed:', error)
        }
      } else {
        setStatus('Connection failed')
      }
    } catch (error: any) {
      setStatus(`Error: ${error.message || 'Connection failed'}`)
      setIsConnected(false)
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Test Environment</h1>
      
      <div className="space-y-4">
        {!isConnected && (
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded"
            onClick={connectWallet}
          >
            Connect Wallet
          </button>
        )}

        {isConnected && (
          <div className="p-4 bg-green-100 rounded">
            <p>✓ Connected to VeChain Testnet</p>
            <p>Balance: {balance.vet} VET</p>
            <p>Energy: {balance.vtho} VTHO</p>
          </div>
        )}

        <div className="mt-4">
          <h2 className="font-bold">Status:</h2>
          <pre className="bg-gray-100 p-2 rounded">{status}</pre>
        </div>
      </div>
    </div>
  )
} 