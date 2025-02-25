import { vechain } from '../app/lib/vechain/connection';
import { artifacts } from 'hardhat';

async function main() {
  // Get the compiled contract
  const TestNFT = await artifacts.readArtifact("TestNFTCollection");
  
  const collections = [
    ["TestCollection1", "TEST1"],
    ["TestCollection2", "TEST2"],
    ["TestCollection3", "TEST3"],
    ["TestCollection4", "TEST4"],
    ["TestCollection5", "TEST5"]
  ];

  // Connect to VeWorld
  await vechain.connect();

  for (const [name, symbol] of collections) {
    // Deploy using VeWorld
    const connex = new window.Connex({
      node: process.env.NEXT_PUBLIC_VECHAIN_NODE,
      network: 'test'
    });

    // Create deployment transaction
    const deployTx = await connex.vendor.sign('tx', [{
      data: TestNFT.bytecode,
      value: '0',
      gas: 2000000
    }]);

    console.log(`${name} deployment transaction:`, deployTx.txid);
  }
}

main(); 