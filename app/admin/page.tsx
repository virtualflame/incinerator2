"use client"

import { useState } from 'react'
import Link from 'next/link'

// Define the structure for an NFT collection
type Collection = {
  contractAddress: string    // VeChain contract address for the NFT collection
  totalSupply: number       // Total number of NFTs in the collection
  weeklyAllocation: number  // Weekly B3TR token allocation for burning
  startDate: string        // Start date for the burn period
  endDate: string         // End date for the burn period
  imageUrl: string        // URL for collection image display
  collectionName: string  // Name of the NFT collection
}

export default function AdminPage() {
  const [collections, setCollections] = useState<Collection[]>([])
  const [newCollection, setNewCollection] = useState<Collection>({
    contractAddress: '',
    totalSupply: 0,
    weeklyAllocation: 0,
    startDate: '',
    endDate: '',
    imageUrl: '',
    collectionName: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const updatedCollections = [...collections, newCollection]
    setCollections(updatedCollections)
    localStorage.setItem('nftCollections', JSON.stringify(updatedCollections))
    // Reset form
    setNewCollection({
      contractAddress: '',
      totalSupply: 0,
      weeklyAllocation: 0,
      startDate: '',
      endDate: '',
      imageUrl: '',
      collectionName: ''
    })
  }

  return (
    <div className="container mx-auto p-4">
      <header className="mb-8">
        <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
        <Link href="/" className="text-blue-500 hover:underline">
          Back to Home
        </Link>
      </header>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2">Collection Name</label>
          <input
            type="text"
            value={newCollection.collectionName}
            onChange={e => setNewCollection({...newCollection, collectionName: e.target.value})}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-2">Contract Address</label>
          <input
            type="text"
            value={newCollection.contractAddress}
            onChange={e => setNewCollection({...newCollection, contractAddress: e.target.value})}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-2">Total Supply</label>
          <input
            type="number"
            value={newCollection.totalSupply}
            onChange={e => setNewCollection({...newCollection, totalSupply: parseInt(e.target.value)})}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-2">Weekly Allocation</label>
          <input
            type="number"
            value={newCollection.weeklyAllocation}
            onChange={e => setNewCollection({...newCollection, weeklyAllocation: parseInt(e.target.value)})}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-2">Start Date</label>
          <input
            type="date"
            value={newCollection.startDate}
            onChange={e => setNewCollection({...newCollection, startDate: e.target.value})}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-2">End Date</label>
          <input
            type="date"
            value={newCollection.endDate}
            onChange={e => setNewCollection({...newCollection, endDate: e.target.value})}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-2">Image URL</label>
          <input
            type="url"
            value={newCollection.imageUrl}
            onChange={e => setNewCollection({...newCollection, imageUrl: e.target.value})}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <button 
          type="submit"
          className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Add Collection
        </button>
      </form>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Current Collections</h2>
        {collections.map((collection, index) => (
          <div key={index} className="border p-4 rounded mb-4">
            <h3 className="font-bold">{collection.collectionName}</h3>
            <p>Contract: {collection.contractAddress}</p>
            <p>Supply: {collection.totalSupply}</p>
            <p>Weekly: {collection.weeklyAllocation}</p>
          </div>
        ))}
      </div>
    </div>
  )
} 