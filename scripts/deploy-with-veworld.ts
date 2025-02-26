import { artifacts } from 'hardhat';

async function main() {
  const TestNFT = await artifacts.readArtifact("TestNFTCollection");
  
  const deployTx = await window.connex.vendor.sign('tx', [{
    to: null,
    value: '0',
    data: TestNFT.bytecode,
    gas: 2000000
  }]).request();
} 