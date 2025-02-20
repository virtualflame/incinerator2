import { getConnex } from './connex'

// ERC721 (NFT) Interface
export const ERC721_ABI = [
  // Read functions
  "function balanceOf(address owner) view returns (uint256)",
  "function ownerOf(uint256 tokenId) view returns (address)",
  "function tokenURI(uint256 tokenId) view returns (string)",
  // Write functions
  "function approve(address to, uint256 tokenId)",
  "function transferFrom(address from, address to, uint256 tokenId)",
  // Events
  "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)",
  "event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId)"
]

// Contract addresses for NFT collections
export const CONTRACT_ADDRESSES = {
  BURN_ADDRESS: '0x0000000000000000000000000000000000000000', // Standard burn address
  NFT_COLLECTIONS: {
    // We'll populate this from your admin panel
  }
}

// Type for NFT Collection data
export type NFTCollection = {
  contractAddress: string
  collectionName: string
  totalSupply: number
  weeklyAllocation: number
  startDate: string
  endDate: string
}

// Helper function to get contract instance
export const getNFTContract = (contractAddress: string) => {
  const connex = getConnex()
  if (!connex) throw new Error('Connex not initialized')
  
  return connex.thor.account(contractAddress)
}

// Helper function to validate contract address
export const isValidContract = async (contractAddress: string) => {
  try {
    const contract = getNFTContract(contractAddress)
    const code = await contract.getCode()
    return code.length > 2 // Check if contract exists
  } catch (error) {
    return false
  }
} 