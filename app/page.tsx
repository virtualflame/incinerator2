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
      const parsedCollections = JSON.parse(savedCollections)
      setCollections(parsedCollections)
    }
    setIsLoading(false)
  }, [])

  return (
    <div className="container">
      <header>
        <h1>VFS Incinerator</h1>
      </header>
      {/* Rest of your UI without web3 components */}
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

