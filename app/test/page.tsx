"use client"

import { useState, useEffect } from 'react'
import { vechain } from '../lib/vechain/connection'
import { TEST_NFT_BYTECODE, TEST_NFT_ABI } from '../lib/contracts/bytecode'
import { ethers } from 'ethers'
import { NFTCollection } from '../lib/vechain/types'

interface Collection {
  address: string
  name: string
  symbol: string
  totalSupply: number
}

// Add type for error
type ErrorWithMessage = {
  message: string;
}

export default function TestPage() {
  const [address, setAddress] = useState('')
  const [status, setStatus] = useState('')
  const [balance, setBalance] = useState({ vet: '0', vtho: '0' })
  const [collections, setCollections] = useState<NFTCollection[]>([])
  
  // Add collection form
  const [newCollection, setNewCollection] = useState({
    name: '',
    symbol: ''
  })

  // Add these states
  const [nftBalance, setNftBalance] = useState<{[key: string]: number}>({})
  const [nftCount, setNftCount] = useState(10)
  const [isLoading, setIsLoading] = useState(false)

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
      const err = error as ErrorWithMessage
      console.error('Connection error:', err)
      setStatus(`Error: ${err.message}`)
    }
  }

  const deployCollection = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setStatus('Deploying collection...')
      
      if (!window.connex) {
        throw new Error('VeWorld not connected')
      }
      
      const connex = window.connex
      
      // Encode constructor parameters (name, symbol, initialOwner)
      const params = window.ethers.utils.defaultAbiCoder.encode(
        ['string', 'string', 'address'],
        [newCollection.name, newCollection.symbol, address] // address is the connected wallet
      )
      
      // Deploy contract
      const deployTx = await connex.vendor.sign('tx', [{
        to: null,  // Required for contract creation
        value: '0',
        data: TEST_NFT_BYTECODE + params.slice(2),
        gas: 2000000
      }]).request()
      
      setStatus('Waiting for deployment...')
      const receipt = await connex.thor.transaction(deployTx.txid).getReceipt()
      
      // Save collection
      const collection = {
        address: receipt.outputs[0].contractAddress,
        name: newCollection.name,
        symbol: newCollection.symbol,
        totalSupply: 100
      } as NFTCollection
      
      setCollections(prev => [...prev, collection])
      setStatus('Collection deployed!')
    } catch (error) {
      const err = error as ErrorWithMessage
      setStatus(`Error: ${err.message}`)
    }
  }

  const mintNFTs = async (collection: NFTCollection) => {
    try {
      setIsLoading(true)
      setStatus(`Minting NFTs for ${collection.name}...`)

      await vechain.connect()
      const connex = window.connex
      if (!connex) throw new Error('VeWorld not connected')

      // Create contract interface
      const abi = new ethers.Interface(TEST_NFT_ABI)
      const mintData = abi.encodeFunctionData('batchMint', [10])

      // Send mint transaction
      const tx = await connex.vendor.sign('tx', [{
        to: collection.address,
        value: '0',
        data: mintData,
        gas: 2000000
      }]).request()

      setStatus(`Waiting for mint confirmation...`)
      const receipt = await connex.thor.transaction(tx.txid).getReceipt()
      
      setStatus(`Successfully minted 10 NFTs for ${collection.name}`)
    } catch (error: any) {
      setStatus(`Error: ${error?.message || 'Unknown error'}`)
    } finally {
      setIsLoading(false)
    }
  }

  // Add this function
  const getCollectionInfo = async (collection: NFTCollection) => {
    try {
      const connex = window.connex
      const abi = new ethers.Interface(TEST_NFT_ABI)
      
      // Get NFT balance
      const data = abi.encodeFunctionData('balanceOf', [address])
      const balance = await connex.thor
        .account(collection.address)
        .method(abi.getFunction('balanceOf'))
        .call(address)
      
      setNftBalance(prev => ({
        ...prev,
        [collection.address]: Number(balance.decoded[0])
      }))
    } catch (error) {
      const err = error as ErrorWithMessage
      console.error('Error getting collection info:', err)
    }
  }

  // Add this effect to load saved collections
  useEffect(() => {
    const savedCollections = localStorage.getItem('testCollections')
    if (savedCollections) {
      setCollections(JSON.parse(savedCollections))
    }
  }, [])

  // Add this effect to load collection info
  useEffect(() => {
    if (address && collections.length > 0) {
      collections.forEach(getCollectionInfo)
    }
  }, [address, collections])

  // Save collections to localStorage
  useEffect(() => {
    if (collections.length > 0) {
      localStorage.setItem('testCollections', JSON.stringify(collections))
    }
  }, [collections])

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
                <p className="text-gray-700 text-sm">VET Balance</p>
                <p className="text-lg font-bold">{balance.vet}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-gray-700 text-sm">VTHO Balance</p>
                <p className="text-lg font-bold">{balance.vtho}</p>
              </div>
            </div>
          </div>
        )}

        {status && (
          <p className="mt-4 text-gray-800">{status}</p>
        )}
      </div>

      <div className="mt-8 bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Test Collections</h2>
        
        {/* Deploy Form */}
        <form onSubmit={deployCollection} className="space-y-4 mb-8">
          <div>
            <label className="block text-sm font-semibold mb-1">Collection Name</label>
            <input
              type="text"
              value={newCollection.name}
              onChange={e => setNewCollection(prev => ({ ...prev, name: e.target.value }))}
              className="w-full p-2 border rounded text-black"
              placeholder="Test Collection"
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold mb-1">Symbol</label>
            <input
              type="text"
              value={newCollection.symbol}
              onChange={e => setNewCollection(prev => ({ ...prev, symbol: e.target.value }))}
              className="w-full p-2 border rounded"
              placeholder="TEST"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Number of NFTs</label>
            <input
              type="number"
              min="1"
              max="100"
              value={nftCount}
              onChange={e => setNftCount(Number(e.target.value))}
              className="w-full p-2 border rounded text-black"
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
              <p className="text-sm text-gray-700">{collection.symbol}</p>
              <p className="font-mono text-xs mt-2">{collection.address}</p>
              <p className="text-sm mt-2">Your NFTs: {nftBalance[collection.address] || 0}</p>
              
              <button
                className="mt-3 px-3 py-1 bg-green-500 text-white text-sm rounded disabled:opacity-50"
                onClick={() => mintNFTs(collection)}
                disabled={isLoading}
              >
                Mint 10 NFTs
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 