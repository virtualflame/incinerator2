import { ethers } from "hardhat";

async function main() {
  const collections = [
    ["TestCollection1", "TEST1"],
    ["TestCollection2", "TEST2"],
    ["TestCollection3", "TEST3"],
    ["TestCollection4", "TEST4"],
    ["TestCollection5", "TEST5"]
  ];

  for (const [name, symbol] of collections) {
    const TestNFT = await ethers.getContractFactory("TestNFTCollection");
    const nft = await TestNFT.deploy(name, symbol);
    await nft.deployed();

    console.log(`${name} deployed to:`, nft.address);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 