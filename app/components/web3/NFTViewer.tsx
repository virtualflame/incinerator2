"use client"

import { useVeChain } from '@/hooks/useVeChain'
import { getNFTContract, ERC721_ABI } from '@/lib/vechain/contracts'
import { useState, useEffect } from 'react'
import { isTestnet } from '@/lib/vechain/connex'

type NFT = {
  tokenId: string
  imageUrl: string | null
  metadata: any
}

export function NFTViewer({ contractAddress }: { contractAddress: string }) {
  const { account } = useVeChain()
  const [nfts, setNfts] = useState<NFT[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchNFTs = async () => {
      if (!account) return

      try {
        if (isTestnet()) {
          console.log('Fetching NFTs on testnet')
          // Add testnet-specific logic here
        }

        const contract = getNFTContract(contractAddress)
        // Get balance
        const balance = await contract.method(ERC721_ABI[0]).call(account)
        
        // This is where we'll need to handle the token URI fetching
        // For now, just store the token IDs
        const tokenIds = [] // We'll implement this properly
        
        setNfts(tokenIds.map(id => ({
          tokenId: id,
          imageUrl: null,
          metadata: null
        })))
      } catch (error) {
        console.error('Error fetching NFTs:', error)
        if (isTestnet()) {
          console.log('Make sure you have testnet tokens')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchNFTs()
  }, [account, contractAddress])

  if (loading) return <div>Loading your NFTs...</div>
  if (!nfts.length) return <div>No NFTs found in this collection</div>

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {nfts.map(nft => (
        <div key={nft.tokenId} className="border rounded-lg p-4">
          <p>Token ID: {nft.tokenId}</p>
          {/* We'll add image display once we implement metadata fetching */}
        </div>
      ))}
    </div>
  )
} 