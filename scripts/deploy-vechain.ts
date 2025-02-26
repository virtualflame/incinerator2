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
    const connex = window.connex;
    if (!connex) {
      throw new Error("VeWorld not connected");
    }

    // Create deployment transaction
    const signedTx = await connex.vendor.sign('tx', [{
      to: null,
      value: '0',
      data: TestNFT.bytecode,
      gas: 2000000
    }]);

    const deployTx = await signedTx.request();
    console.log(`${name} deployment transaction:`, deployTx.txid);
  }
}

main(); 