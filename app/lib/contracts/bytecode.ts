// Create a module to handle contract artifacts
const ContractArtifacts = {
  bytecode: '',
  abi: [] as any[],
  address: ''
}

// Try to load from env vars first
if (process.env.NEXT_PUBLIC_TEST_NFT_BYTECODE) {
  ContractArtifacts.bytecode = process.env.NEXT_PUBLIC_TEST_NFT_BYTECODE
}
if (process.env.NEXT_PUBLIC_TEST_NFT_ABI) {
  try {
    ContractArtifacts.abi = JSON.parse(process.env.NEXT_PUBLIC_TEST_NFT_ABI)
  } catch {
    console.warn('Failed to parse TEST_NFT_ABI from env')
  }
}

// Then try to load from artifacts
try {
  const artifact = require('../../artifacts/contracts/TestNFTCollection.sol/TestNFTCollection.json')
  if (artifact) {
    ContractArtifacts.bytecode = artifact.bytecode
    ContractArtifacts.abi = artifact.abi
  }
} catch (error) {
  console.warn('Contract artifacts not found, using default values')
}

// Export the values
export const TEST_NFT_BYTECODE = ContractArtifacts.bytecode
export const TEST_NFT_ABI = ContractArtifacts.abi
export const TEST_NFT_ADDRESS = ContractArtifacts.address 