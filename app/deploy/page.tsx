"use client"

import { useState } from 'react'
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
  const [deployedAddresses, setDeployedAddresses] = useState<string[]>([])
  const [isDeploying, setIsDeploying] = useState(false)

  const deployCollection = async (name: string, symbol: string) => {
    try {
      setIsDeploying(true)
      setStatus(`Deploying ${name}...`)
      
      await vechain.connect()
      const address = await vechain.deployContract(
        TEST_NFT_BYTECODE,
        ethers.AbiCoder.defaultAbiCoder().encode(
          ['string', 'string', 'address'],
          [name, symbol, await vechain.getAddress()]
        )
      )
      
      setStatus(`${name} deployed to ${address}`)
      setDeployedAddresses(prev => [...prev, address])
    } catch (error: any) {
      setStatus(`Error: ${error?.message || 'Unknown error'}`)
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
        <button 
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
          onClick={deployAllCollections}
          disabled={isDeploying}
        >
          Deploy All Collections
        </button>

        {TEST_COLLECTIONS.map((collection, i) => (
          <button
            key={i}
            className="block px-4 py-2 bg-purple-500 text-white rounded disabled:opacity-50"
            onClick={() => deployCollection(collection.name, collection.symbol)}
            disabled={isDeploying}
          >
            Deploy {collection.name}
          </button>
        ))}

        <div className="mt-4">
          <h2 className="font-bold">Deployment Status:</h2>
          <pre className="bg-gray-100 p-2 rounded">{status}</pre>
        </div>

        <div className="mt-4">
          <h2 className="font-bold">Deployed Collections:</h2>
          <ul className="list-disc pl-4">
            {deployedAddresses.map((addr, i) => (
              <li key={i}>{addr}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
} 