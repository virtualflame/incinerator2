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
          <Link href="/mission" className="button">
            <span>Mission</span>
          </Link>
          <Link href="#" className="button">
            <span>Contact</span>
          </Link>
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

