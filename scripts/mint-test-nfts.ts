import { ethers } from "hardhat";

async function main() {
  // Replace these with your deployed contract addresses
  const deployedCollections = [
    "0x...", // TestCollection1 address
    "0x...", // TestCollection2 address
    "0x...", // TestCollection3 address
    "0x...", // TestCollection4 address
    "0x..."  // TestCollection5 address
  ];

  for (const address of deployedCollections) {
    console.log(`Minting NFTs for collection ${address}`);
    
    const collection = await ethers.getContractAt("TestNFTCollection", address);
    
    // Mint 100 NFTs
    for (let i = 0; i < 100; i++) {
      const tx = await collection.mint();
      await tx.wait();
      console.log(`Minted NFT #${i}`);
    }
    
    console.log(`Finished minting collection ${address}\n`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 