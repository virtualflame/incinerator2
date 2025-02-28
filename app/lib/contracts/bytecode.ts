// Provide default values in case artifacts aren't available
export const TEST_NFT_BYTECODE = process.env.NEXT_PUBLIC_TEST_NFT_BYTECODE || ''
export const TEST_NFT_ABI = process.env.NEXT_PUBLIC_TEST_NFT_ABI || []
export const TEST_NFT_ADDRESS = ''

// Try to import artifacts if available
try {
  const artifact = require('../../artifacts/contracts/TestNFTCollection.sol/TestNFTCollection.json')
  if (artifact) {
    TEST_NFT_BYTECODE = artifact.bytecode
    TEST_NFT_ABI = artifact.abi
  }
} catch (error) {
  console.warn('Contract artifacts not found, using default values')
} 