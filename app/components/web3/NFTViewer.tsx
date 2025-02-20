"use client"

import { useState, useEffect } from 'react'
import { useVeChain } from '../../hooks/useVeChain'
import { getNFTContract, ERC721_ABI } from '../../lib/vechain/contracts'

interface NFT {
  tokenId: string
  imageUrl: string | null
  metadata: any | null  // We'll type this properly later
}

export function NFTViewer({ contractAddress }: { contractAddress: string }) {
  const { account } = useVeChain()
  const [nfts, setNfts] = useState<NFT[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchNFTs = async () => {
      if (!account || !contractAddress) return

      try {
        const contract = getNFTContract(contractAddress)
        // Get balance using proper ABI object
        const balanceMethod = contract.method({
          constant: true,
          inputs: [{ name: "owner", type: "address" }],
          name: "balanceOf",
          outputs: [{ name: "balance", type: "uint256" }],
          type: "function"
        })
        const balance = await balanceMethod.call(account)
        
        // Initialize array with proper type
        const tokenIds: string[] = []
        
        setNfts(tokenIds.map(id => ({
          tokenId: id,
          imageUrl: null,
          metadata: null
        })))
      } catch (error) {
        console.error('Error fetching NFTs:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchNFTs()
  }, [account, contractAddress])

  if (loading) return <div>Loading NFTs...</div>
  if (nfts.length === 0) return <div>No NFTs found</div>

  return (
    <div className="grid grid-cols-2 gap-4">
      {nfts.map(nft => (
        <div key={nft.tokenId} className="border p-4 rounded">
          <p>Token ID: {nft.tokenId}</p>
          {nft.imageUrl && <img src={nft.imageUrl} alt={`NFT ${nft.tokenId}`} />}
        </div>
      ))}
    </div>
  )
} 