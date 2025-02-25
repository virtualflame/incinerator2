"use client"

import { useState, useEffect } from 'react'
import { vechain } from '../lib/vechain/connection'

interface Collection {
  address: string
  name: string
  symbol: string
  totalSupply: number
}

export default function TestPage() {
  const [address, setAddress] = useState('')
  const [status, setStatus] = useState('')
  const [balance, setBalance] = useState({ vet: '0', vtho: '0' })
  const [mintStatus, setMintStatus] = useState('')
  const [deployStatus, setDeployStatus] = useState('')
  const [collections, setCollections] = useState<Collection[]>([])
  
  // Add collection form
  const [newCollection, setNewCollection] = useState({
    name: '',
    symbol: ''
  })

  // Connect wallet
  const connectWallet = async () => {
    try {
      setStatus('Checking for VeWorld...')
      const status = await vechain.connect()
      
      if (status.isConnected) {
        setAddress(status.address || '')
        setStatus('Connected!')
        
        // Get balance after connecting
        if (status.address) {
          const balances = await vechain.getBalance(status.address)
          setBalance(balances)
        }
      }
    } catch (error) {
      console.error('Connection error:', error)
      setStatus(`Error: ${error.message}`)
    }
  }

  const mintTestNFT = async () => {
    try {
      setMintStatus('Minting...')
      
      // Get contract instance (we'll add this)
      const nft = await vechain.getContract(
        TEST_NFT_ADDRESS,  // We'll get this after deployment
        TEST_NFT_ABI
      )

      // Mint NFT
      const tx = await nft.mint()
      await tx.wait()

      setMintStatus('NFT Minted!')
    } catch (error) {
      console.error('Mint error:', error)
      setMintStatus(`Error: ${error.message}`)
    }
  }

  const deployCollection = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setStatus('Deploying collection...')
      
      // Deploy using VeWorld
      const connex = window.connex
      const bytecode = "..." // We'll get this after compiling TestNFTCollection
      
      const txResponse = await connex.vendor.sign('tx', [{
        value: '0',
        data: bytecode,
        gas: 2000000
      }]).request()
      
      // Wait for deployment
      setStatus('Waiting for deployment...')
      await connex.thor.transaction(txResponse.txid).getReceipt()
      
      // Save collection
      const collection = {
        address: txResponse.txid, // This will be the contract address
        name: newCollection.name,
        symbol: newCollection.symbol,
        totalSupply: 100
      }
      
      setCollections(prev => [...prev, collection])
      setStatus('Collection deployed!')
    } catch (error) {
      setStatus(`Error: ${error.message}`)
    }
  }

  const mintNFT = async (address: string) => {
    try {
      setMintStatus('Minting...')
      
      // Get contract instance (we'll add this)
      const nft = await vechain.getContract(
        address,  // Use the collection address
        TEST_NFT_ABI
      )

      // Mint NFT
      const tx = await nft.mint()
      await tx.wait()

      setMintStatus('NFT Minted!')
    } catch (error) {
      console.error('Mint error:', error)
      setMintStatus(`Error: ${error.message}`)
    }
  }

  // Add this effect to load saved collections
  useEffect(() => {
    const savedCollections = localStorage.getItem('testCollections')
    if (savedCollections) {
      setCollections(JSON.parse(savedCollections))
    }
  }, [])

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">NFT Recycler Test Environment</h1>
      
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Wallet Connection</h2>
        
        {!address ? (
          <button 
            onClick={connectWallet}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Connect VeWorld
          </button>
        ) : (
          <div className="space-y-4">
            <div>
              <p className="text-green-600">✓ Wallet Connected</p>
              <p className="font-mono bg-gray-100 p-2 rounded text-sm">
                {address}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-gray-500 text-sm">VET Balance</p>
                <p className="text-lg font-bold">{balance.vet}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-gray-500 text-sm">VTHO Balance</p>
                <p className="text-lg font-bold">{balance.vtho}</p>
              </div>
            </div>
          </div>
        )}

        {status && (
          <p className="mt-4 text-gray-600">{status}</p>
        )}

        <button 
          onClick={mintTestNFT}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Mint Test NFT
        </button>
      </div>

      <div className="mt-8 bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Test Collections</h2>
        
        {/* Deploy Form */}
        <form onSubmit={deployCollection} className="space-y-4 mb-8">
          <div>
            <label className="block text-sm font-medium mb-1">Collection Name</label>
            <input
              type="text"
              value={newCollection.name}
              onChange={e => setNewCollection(prev => ({ ...prev, name: e.target.value }))}
              className="w-full p-2 border rounded"
              placeholder="Test Collection"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Symbol</label>
            <input
              type="text"
              value={newCollection.symbol}
              onChange={e => setNewCollection(prev => ({ ...prev, symbol: e.target.value }))}
              className="w-full p-2 border rounded"
              placeholder="TEST"
            />
          </div>

          <button 
            type="submit"
            className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
          >
            Deploy New Collection
          </button>
        </form>

        {/* Collections List */}
        <div className="space-y-4">
          {collections.map((collection, i) => (
            <div key={i} className="border rounded p-4">
              <h3 className="font-bold">{collection.name}</h3>
              <p className="text-sm text-gray-500">{collection.symbol}</p>
              <p className="font-mono text-xs mt-2">{collection.address}</p>
              
              {/* Add mint button to each collection */}
              <button 
                onClick={() => mintNFT(collection.address)}
                className="mt-3 px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600"
              >
                Mint NFT
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 