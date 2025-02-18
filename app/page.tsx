"use client"

import Link from "next/link"
import { useState, useEffect } from "react"

// Import the Collection type
type Collection = {
  contractAddress: string
  totalSupply: number
  weeklyAllocation: number
  startDate: string
  endDate: string
  imageUrl: string
  collectionName: string
}

export default function Home() {
  const [collections, setCollections] = useState<Collection[]>([])

  // For now, we'll use localStorage to share data between admin and user pages
  useEffect(() => {
    const savedCollections = localStorage.getItem('nftCollections')
    if (savedCollections) {
      const parsedCollections = JSON.parse(savedCollections)
      console.log('Loaded collections:', parsedCollections) // Debug log
      setCollections(parsedCollections)
    }
  }, [])

  return (
    <div className="container">
      <header>
        <h1>VFS Incinerator</h1>
      </header>
      <main>
        <div className="button-container">
          <Link href="#" className="button flame-button">
            <span>Burn Now</span>
          </Link>
          <Link href="/mission" className="button">
            <span>Mission</span>
          </Link>
          <Link href="#" className="button">
            <span>Vote</span>
          </Link>
          <Link href="#" className="button">
            <span>Contact</span>
          </Link>
        </div>

        {/* Display NFT Collections */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16 max-w-6xl mx-auto px-4">
          {collections.map((collection, index) => (
            <div key={index} className="relative border-2 border-gray-300 rounded-lg overflow-hidden hover:border-gray-400 transition-all max-w-sm mx-auto">
              {collection.imageUrl && (
                <div className="aspect-video w-full overflow-hidden">
                  <img 
                    src={collection.imageUrl}
                    alt={collection.collectionName}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-4 bg-white/90 backdrop-blur">
                <h2 className="text-xl font-bold mb-3">{collection.collectionName}</h2>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Supply:</span>
                    <span className="font-medium">{collection.totalSupply}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Weekly B3TR:</span>
                    <span className="font-medium">{collection.weeklyAllocation}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
      <footer>
        <p>&copy; 2025 VFS Incinerator. All rights reserved.</p>
      </footer>
    </div>
  )
}

