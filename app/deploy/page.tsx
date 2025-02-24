"use client"

import { useState } from 'react'
import { vechain } from '../lib/vechain/connection'
import { TEST_NFT_BYTECODE, TEST_NFT_ABI } from '../lib/contracts/bytecode'

export default function DeployPage() {
  const [status, setStatus] = useState('')
  const [deployedAddresses, setDeployedAddresses] = useState<string[]>([])

  const deployCollection = async (name: string, symbol: string) => {
    try {
      // Connect to VeWorld
      await vechain.connect()
      
      // Deploy using VeWorld
      const connex = new window.Connex({
        node: process.env.NEXT_PUBLIC_VECHAIN_NODE,
        network: 'test'
      })

      // Create the constructor data
      const constructorData = web3.eth.abi.encodeParameters(
        ['string', 'string'],
        [name, symbol]
      )

      const deployTx = await connex.vendor.sign('tx', [{
        data: TEST_NFT_BYTECODE + constructorData.slice(2),
        value: '0',
        gas: 2000000
      }])

      setStatus(`Deployed ${name}: ${deployTx.txid}`)
      setDeployedAddresses(prev => [...prev, deployTx.txid])
    } catch (error) {
      setStatus(`Error: ${error.message}`)
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Deploy Test Collections</h1>
      
      <div className="space-y-4">
        <button 
          className="px-4 py-2 bg-blue-500 text-white rounded"
          onClick={() => deployCollection("TestCollection1", "TEST1")}
        >
          Deploy Collection 1
        </button>

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