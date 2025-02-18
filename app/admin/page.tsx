"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

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
  // State management for authentication and collections
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [collections, setCollections] = useState<Collection[]>([{
    contractAddress: "",
    totalSupply: 0,
    weeklyAllocation: 0,
    startDate: "",
    endDate: "",
    imageUrl: "",
    collectionName: ""
  }])

  // Handle saving collections
  const handleSaveAll = () => {
    localStorage.setItem('nftCollections', JSON.stringify(collections))
    console.log('Saving collections:', collections)
    alert('Collections saved successfully!')
  }

  // Handle saving individual collection
  const handleSaveCollection = (index: number) => {
    const savedCollections = localStorage.getItem('nftCollections')
    const allCollections = savedCollections ? JSON.parse(savedCollections) : []
    allCollections[index] = collections[index]
    localStorage.setItem('nftCollections', JSON.stringify(allCollections))
    console.log('Saving collection:', collections[index])
    alert(`Collection #${index + 1} saved successfully!`)
  }

  // Handle admin login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      setIsAuthenticated(true)
    } else {
      alert("Invalid password")
    }
  }

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="container p-4">
        <h1 className="text-2xl font-bold mb-4">VFS Incinerator Admin Panel</h1>
        <form onSubmit={handleLogin}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter admin password"
            className="border p-2 mr-2"
          />
          <button type="submit" className="border p-2 bg-blue-500 text-white">
            Access Admin Panel
          </button>
        </form>
      </div>
    )
  }

  // Main admin interface
  return (
    <div className="container p-4 text-gray-900">
      <h1 className="text-2xl font-bold mb-4">NFT Collection Management</h1>
      <div className="mt-4">
        {collections.map((collection, index) => (
          <div key={index} className="border p-4 mb-4 bg-white rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Collection #{index + 1}</h2>
              <button 
                onClick={() => handleSaveCollection(index)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Save Collection
              </button>
            </div>
            
            {/* Collection Name Input */}
            <label className="block mb-1 font-medium text-gray-900">Collection Name</label>
            <input
              type="text"
              placeholder="Enter collection name"
              value={collection.collectionName}
              onChange={(e) => {
                const newCollections = [...collections]
                newCollections[index].collectionName = e.target.value
                setCollections(newCollections)
              }}
              className="border p-2 mb-2 w-full text-gray-900 bg-white"
            />

            {/* Collection Image URL Input */}
            <label className="block mb-1 font-medium text-gray-900">Collection Image URL</label>
            <input
              type="text"
              placeholder="Enter image URL (e.g., https://example.com/image.png)"
              value={collection.imageUrl}
              onChange={(e) => {
                const newCollections = [...collections]
                newCollections[index].imageUrl = e.target.value
                setCollections(newCollections)
              }}
              className="border p-2 mb-2 w-full text-gray-900 bg-white"
            />
            
            {/* Image Preview */}
            {collection.imageUrl && (
              <div className="mb-4">
                <p className="text-sm mb-2">Preview:</p>
                <img 
                  src={collection.imageUrl} 
                  alt={collection.collectionName || "Collection preview"} 
                  className="w-32 h-32 object-cover rounded-lg border"
                />
              </div>
            )}

            {/* Contract Address Input */}
            <label className="block mb-1 font-medium text-gray-900">VeChain Contract Address</label>
            <input
              type="text"
              placeholder="Enter NFT contract address"
              value={collection.contractAddress}
              onChange={(e) => {
                const newCollections = [...collections]
                newCollections[index].contractAddress = e.target.value
                setCollections(newCollections)
              }}
              className="border p-2 mb-2 w-full text-gray-900 bg-white"
            />

            {/* Total Supply Input */}
            <label className="block mb-1 font-medium text-gray-900">Total NFT Supply</label>
            <input
              type="number"
              placeholder="Enter total supply of NFTs"
              value={collection.totalSupply}
              onChange={(e) => {
                const newCollections = [...collections]
                newCollections[index].totalSupply = parseInt(e.target.value)
                setCollections(newCollections)
              }}
              className="border p-2 mb-2 w-full text-gray-900 bg-white"
            />

            {/* Weekly Allocation Input */}
            <label className="block mb-1 font-medium text-gray-900">Weekly B3TR Allocation</label>
            <input
              type="number"
              placeholder="Enter B3TR token allocation"
              value={collection.weeklyAllocation}
              onChange={(e) => {
                const newCollections = [...collections]
                newCollections[index].weeklyAllocation = parseInt(e.target.value)
                setCollections(newCollections)
              }}
              className="border p-2 mb-2 w-full text-gray-900 bg-white"
            />

            {/* Start Date Input */}
            <label className="block mb-1 font-medium text-gray-900">Start Date</label>
            <input
              type="date"
              value={collection.startDate}
              onChange={(e) => {
                const newCollections = [...collections]
                newCollections[index].startDate = e.target.value
                setCollections(newCollections)
              }}
              className="border p-2 mb-2 w-full text-gray-900 bg-white"
            />

            {/* End Date Input */}
            <label className="block mb-1 font-medium text-gray-900">End Date</label>
            <input
              type="date"
              value={collection.endDate}
              onChange={(e) => {
                const newCollections = [...collections]
                newCollections[index].endDate = e.target.value
                setCollections(newCollections)
              }}
              className="border p-2 mb-2 w-full text-gray-900 bg-white"
            />
          </div>
        ))}

        <div className="flex gap-4 mt-6">
          <button
            onClick={() => setCollections([...collections, {
              contractAddress: "",
              totalSupply: 0,
              weeklyAllocation: 0,
              startDate: "",
              endDate: "",
              imageUrl: "",
              collectionName: ""
            }])}
            className="border p-2 bg-green-500 text-white hover:bg-green-600 rounded"
          >
            Add New NFT Collection
          </button>

          <button
            onClick={handleSaveAll}
            className="border p-2 bg-purple-500 text-white hover:bg-purple-600 rounded"
          >
            Save All Changes
          </button>
        </div>
      </div>
    </div>
  )
} 