import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  const TestNFT = await ethers.getContractFactory("TestNFTCollection");
  
  const collections = [
    ["TestCollection1", "TEST1"],
    ["TestCollection2", "TEST2"],
    ["TestCollection3", "TEST3"]
  ];

  for (const [name, symbol] of collections) {
    try {
      console.log(`Deploying ${name}...`);
      
      // Deploy collection
      const nft = await TestNFT.deploy(name, symbol, deployer.address);
      const tx = await nft.deploymentTransaction();
      if (tx) {
        console.log('Waiting for deployment confirmation...');
        await tx.wait();
        const contractAddress = await nft.getAddress();
        console.log(`${name} deployed to:`, contractAddress);

        // Verify deployment
        const code = await ethers.provider.getCode(contractAddress);
        if (code === '0x') {
          throw new Error('Contract deployment failed - no code at address');
        }
        console.log('Contract verified ✓');
      }
    } catch (error) {
      console.error(`Error deploying ${name}:`, error);
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 