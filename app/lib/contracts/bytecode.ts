// Import the artifact as a default import
import artifact from '../../artifacts/contracts/TestNFTCollection.sol/TestNFTCollection.json'

// Export the bytecode and ABI from the artifact
export const TEST_NFT_BYTECODE = artifact.bytecode
export const TEST_NFT_ABI = artifact.abi

// We'll update this after deploying the first collection
export const TEST_NFT_ADDRESS = '' 