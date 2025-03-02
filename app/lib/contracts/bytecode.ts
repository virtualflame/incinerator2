// Create a module to handle contract artifacts
const ContractArtifacts = {
  bytecode: "",
  abi: [] as any[],
  address: ""
}

// Try to load from env vars first
if (process.env.NEXT_PUBLIC_TEST_NFT_BYTECODE) {
  ContractArtifacts.bytecode = process.env.NEXT_PUBLIC_TEST_NFT_BYTECODE
}
if (process.env.NEXT_PUBLIC_TEST_NFT_ABI) {
  try {
    ContractArtifacts.abi = JSON.parse(process.env.NEXT_PUBLIC_TEST_NFT_ABI)
  } catch {
    console.warn("Failed to parse TEST_NFT_ABI from env")
  }
}

try {
  // Only try to load artifacts in browser environment
  if (typeof window !== 'undefined') {
    const artifacts = require('../../artifacts/contracts/TestNFTCollection.sol/TestNFTCollection.json')
    ContractArtifacts.bytecode = artifacts.bytecode
    ContractArtifacts.abi = artifacts.abi
  }
} catch (error) {
  console.log('Contract artifacts not found, using default values')
}

// Export the values
export const TEST_NFT_BYTECODE = ContractArtifacts.bytecode
export const TEST_NFT_ABI = ContractArtifacts.abi
export const TEST_NFT_ADDRESS = ContractArtifacts.address
