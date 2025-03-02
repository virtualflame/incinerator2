"use client"

import { useState, useEffect } from 'react'
import { vechain } from '../lib/vechain/connection'
import { TEST_NFT_BYTECODE, TEST_NFT_ABI } from '../lib/contracts/bytecode'
import { ethers } from 'ethers'

const TEST_COLLECTIONS = [
  { name: "TestCollection1", symbol: "TEST1" },
  { name: "TestCollection2", symbol: "TEST2" },
  { name: "TestCollection3", symbol: "TEST3" }
]

export default function DeployPage() {
  const [status, setStatus] = useState('')
  const [isConnected, setIsConnected] = useState(false)
  const [isDeploying, setIsDeploying] = useState(false)
  const [balance, setBalance] = useState({ vet: '0', vtho: '0' })

  // Only check connection on mount
  useEffect(() => {
    const init = async () => {
      try {
        const status = await vechain.connect()
        setIsConnected(status.isConnected)
        if (status.isConnected && status.address) {
          const bal = await vechain.getBalance(status.address)
          setBalance(bal)
        }
      } catch (error) {
        console.log('Initial connection check failed:', error)
      }
    }
    init()
  }, [])

  const connectWallet = async () => {
    try {
      setStatus('Connecting to VeWorld...')
      const status = await vechain.connect()
      
      if (status.isConnected && status.address) {
        setIsConnected(true)
        setStatus('Connected!')
        
        // Get balance after successful connection
        const bal = await vechain.getBalance(status.address)
        setBalance(bal)
      } else {
        setStatus('Connection failed')
      }
    } catch (error: any) {
      setStatus(`Error: ${error.message || 'Connection failed'}`)
    }
  }

  const deployCollection = async (name: string, symbol: string) => {
    if (!isConnected) {
      setStatus('Please connect wallet first')
      return
    }

    try {
      setIsDeploying(true)
      setStatus(`Deploying ${name}...`)
      
      const address = await vechain.deployContract(
        TEST_NFT_BYTECODE,
        ethers.AbiCoder.defaultAbiCoder().encode(
          ['string', 'string', 'address'],
          [name, symbol, await vechain.getAddress()]
        )
      )
      
      setStatus(`Deployed to ${address}`)
    } catch (error: any) {
      setStatus(`Error: ${error.message || 'Deployment failed'}`)
    } finally {
      setIsDeploying(false)
    }
  }

  const deployAllCollections = async () => {
    for (const collection of TEST_COLLECTIONS) {
      await deployCollection(collection.name, collection.symbol)
    }
    setStatus('All collections deployed!')
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Deploy Test Collections</h1>
      
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
          <button
            className="px-4 py-2 bg-purple-500 text-white rounded disabled:opacity-50"
            onClick={() => deployCollection('TestNFT', 'TEST')}
            disabled={isDeploying}
          >
            Deploy Test Collection
          </button>
        )}

        <div className="mt-4">
          <h2 className="font-bold">Status:</h2>
          <pre className="bg-gray-100 p-2 rounded">{status}</pre>
        </div>
      </div>
    </div>
  )
} 