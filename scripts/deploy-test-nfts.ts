import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  const TestNFT = await ethers.getContractFactory("TestNFTCollection");
  
  const name = "Test Collection";
  const symbol = "TEST";
  
  // Add initialOwner parameter
  const nft = await TestNFT.deploy(name, symbol, deployer.address);
  const tx = await nft.deploymentTransaction();
  if (tx) {
    await tx.wait();
    console.log(`${name} deployed to:`, await nft.getAddress());
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 