"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { ConnectWallet } from '@/app/components/web3/ConnectWallet'

// Import the Collection type
type Collection = {
  contractAddress: string    // VeChain contract address for the NFT collection
  totalSupply: number       // Total number of NFTs in the collection
  weeklyAllocation: number  // Weekly B3TR token allocation for burning
  startDate: string        // Start date for the burn period
  endDate: string         // End date for the burn period
  imageUrl: string        // URL for collection image display
  collectionName: string  // Name of the NFT collection
}

export default function Home() {
  const [collections, setCollections] = useState<Collection[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // For now, we'll use localStorage to share data between admin and user pages
  useEffect(() => {
    const savedCollections = localStorage.getItem('nftCollections')
    if (savedCollections) {
      const parsedCollections = JSON.parse(savedCollections)
      console.log('Loaded collections:', parsedCollections) // Debug log
      setCollections(parsedCollections)
    }
    setIsLoading(false)
  }, [])

  return (
    <div className="container">
      <header>
        <h1>VFS Incinerator</h1>
        <div className="mt-4">
          <ConnectWallet />
        </div>
      </header>
      <main>
        <div className="button-container mb-12">
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

        {/* NFT Collections Trading Card Grid */}
        <div className="grid grid-cols-2 gap-8 mt-8 max-w-4xl mx-auto px-6">
          {isLoading ? (
            <div className="col-span-2 text-center py-8">Loading collections...</div>
          ) : collections.length === 0 ? (
            <div className="col-span-2 text-center py-8">No collections available</div>
          ) : (
            collections.map((collection, index) => (
              <div 
                key={`collection-${collection.contractAddress}-${index}`} 
                className="transform transition-all duration-300 hover:scale-105"
              >
                {/* Trading Card Container */}
                <div className="relative overflow-hidden rounded-xl border-4 border-[#ff6600] bg-black/60 shadow-[0_0_15px_rgba(255,102,0,0.3)] hover:shadow-[0_0_25px_rgba(255,102,0,0.5)] transition-all">
                  {/* Card Header */}
                  <div className="p-4 bg-gradient-to-r from-[#ff6600] to-[#ff9933] text-white">
                    <h3 className="text-xl font-bold truncate">
                      {collection.collectionName}
                    </h3>
                  </div>

                  {/* Card Image */}
                  <div className="relative aspect-square">
                    <img
                      src={collection.imageUrl}
                      alt={collection.collectionName}
                      className="w-full h-full object-cover"
                    />
                    {/* Holographic Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-transparent opacity-20"></div>
                  </div>

                  {/* Card Stats */}
                  <div className="p-4 space-y-2">
                    {/* Stats Box */}
                    <div className="bg-black/40 rounded-lg p-3 backdrop-blur-sm">
                      <div className="grid grid-cols-2 gap-2 text-white">
                        <div className="text-center p-2 bg-black/50 rounded">
                          <p className="text-xs text-[#ff9933]">Total Supply</p>
                          <p className="text-lg font-bold">{collection.totalSupply}</p>
                        </div>
                        <div className="text-center p-2 bg-black/50 rounded">
                          <p className="text-xs text-[#ff9933]">Weekly B3TR</p>
                          <p className="text-lg font-bold text-[#ff6600]">{collection.weeklyAllocation}</p>
                        </div>
                      </div>
                    </div>

                    {/* Contract Address */}
                    <div className="mt-2 bg-black/30 rounded p-2">
                      <p className="text-xs text-[#ff9933] font-mono break-all text-center">
                        {collection.contractAddress}
                      </p>
                    </div>

                    {/* Dates */}
                    <div className="flex justify-between text-xs text-[#ff9933] mt-2">
                      <span>Start: {new Date(collection.startDate).toLocaleDateString()}</span>
                      <span>End: {new Date(collection.endDate).toLocaleDateString()}</span>
                    </div>

                    {/* Add this just before closing the Card Stats div */}
                    <button className="w-full mt-4 p-2 bg-gradient-to-r from-[#ff6600] to-[#ff9933] text-white rounded-lg hover:scale-105 transition-transform relative overflow-hidden group">
                      <span className="relative z-10">Burn This NFT</span>
                      <div className="absolute inset-0 bg-gradient-to-t from-[#ff3300] to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
      <footer>
        <p>&copy; 2025 VFS Incinerator. All rights reserved.</p>
      </footer>
    </div>
  )
}

