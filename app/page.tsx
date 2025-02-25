"use client"

import Link from "next/link"
import { useState, useEffect, Suspense } from "react"

// Remove web3 imports and components
type Collection = {
  contractAddress: string
  totalSupply: number
  weeklyAllocation: number
  startDate: string
  endDate: string
  imageUrl: string
  collectionName: string
}

const PageContent = () => {
  const [collections, setCollections] = useState<Collection[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const savedCollections = localStorage.getItem('nftCollections')
    if (savedCollections) {
      setCollections(JSON.parse(savedCollections))
    }
    setIsLoading(false)
  }, [])

  return (
    <div className="container">
      <header>
        <h1>VFS Incinerator</h1>
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
          <Link 
            href="/test" 
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Test Environment
          </Link>
        </div>

        {/* NFT Collections Grid */}
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
                {/* Collection Card */}
                <div className="relative overflow-hidden rounded-xl border-4 border-[#ff6600] bg-black/60 shadow-[0_0_15px_rgba(255,102,0,0.3)]">
                  <div className="p-4 bg-gradient-to-r from-[#ff6600] to-[#ff9933] text-white">
                    <h3 className="text-xl font-bold truncate">{collection.collectionName}</h3>
                  </div>
                  
                  {/* Collection Image */}
                  <div className="relative aspect-square">
                    <img
                      src={collection.imageUrl}
                      alt={collection.collectionName}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Collection Details */}
                  <div className="p-4 space-y-2">
                    <div className="grid grid-cols-2 gap-2 text-white">
                      <div className="text-center p-2 bg-black/50 rounded">
                        <p className="text-xs text-[#ff9933]">Total Supply</p>
                        <p className="text-lg font-bold">{collection.totalSupply}</p>
                      </div>
                      <div className="text-center p-2 bg-black/50 rounded">
                        <p className="text-xs text-[#ff9933]">Weekly B3TR</p>
                        <p className="text-lg font-bold">{collection.weeklyAllocation}</p>
                      </div>
                    </div>

                    <div className="mt-2 bg-black/30 rounded p-2">
                      <p className="text-xs text-[#ff9933] font-mono break-all">
                        {collection.contractAddress}
                      </p>
                    </div>

                    <div className="flex justify-between text-xs text-[#ff9933]">
                      <span>Start: {new Date(collection.startDate).toLocaleDateString()}</span>
                      <span>End: {new Date(collection.endDate).toLocaleDateString()}</span>
                    </div>
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

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PageContent />
    </Suspense>
  )
}

