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
  const [isTestnet, setIsTestnet] = useState(false)

  const connectWallet = async () => {
    try {
      setStatus('Connecting to VeWorld...')
      const status = await vechain.connect()
      
      if (status.isConnected && status.address) {
        // Check testnet first
        const onTestnet = await vechain.verifyTestnet()
        setIsTestnet(onTestnet)
        
        if (!onTestnet) {
          setStatus('Please switch to VeChain testnet')
          setIsConnected(false)
          return
        }

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
          <>
            <div className="p-4 bg-green-100 rounded">
              <p>✓ Connected to VeChain Testnet</p>
              <p>Balance: {ethers.formatEther(balance.vet)} TEST-VET</p>
              <p>Energy: {ethers.formatEther(balance.vtho)} TEST-VTHO</p>
              {Number(balance.vet) < ethers.parseEther('0.1') && (
                <p className="text-red-500 mt-2">
                  Low balance! Get testnet tokens from the&nbsp;
                  <a 
                    href="https://faucet.vecha.in/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    VeChain Testnet Faucet
                  </a>
                </p>
              )}
            </div>

            <button
              className="px-4 py-2 bg-purple-500 text-white rounded disabled:opacity-50"
              onClick={() => deployCollection('TestNFT', 'TEST')}
              disabled={isDeploying || !isTestnet}
            >
              Deploy Test Collection
            </button>
          </>
        )}

        <div className="mt-4">
          <h2 className="font-bold">Status:</h2>
          <pre className="bg-gray-100 p-2 rounded">{status}</pre>
        </div>
      </div>
    </div>
  )
} 