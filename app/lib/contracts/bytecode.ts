// Initialize variables that will be exported
let TEST_NFT_BYTECODE = ''
let TEST_NFT_ABI: any[] = []
const TEST_NFT_ADDRESS = ''

// Try to load from env vars first
if (process.env.NEXT_PUBLIC_TEST_NFT_BYTECODE) {
  TEST_NFT_BYTECODE = process.env.NEXT_PUBLIC_TEST_NFT_BYTECODE
}
if (process.env.NEXT_PUBLIC_TEST_NFT_ABI) {
  try {
    TEST_NFT_ABI = JSON.parse(process.env.NEXT_PUBLIC_TEST_NFT_ABI)
  } catch {
    console.warn('Failed to parse TEST_NFT_ABI from env')
  }
}

// Then try to load from artifacts
try {
  const artifact = require('../../artifacts/contracts/TestNFTCollection.sol/TestNFTCollection.json')
  if (artifact) {
    TEST_NFT_BYTECODE = artifact.bytecode
    TEST_NFT_ABI = artifact.abi
  }
} catch (error) {
  console.warn('Contract artifacts not found, using default values')
}

// Export the values
export { TEST_NFT_BYTECODE, TEST_NFT_ABI, TEST_NFT_ADDRESS } 