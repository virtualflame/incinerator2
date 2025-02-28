import { artifacts } from 'hardhat';

async function main() {
  const TestNFT = await artifacts.readArtifact("TestNFTCollection");
  
  // Connect to VeWorld on testnet
  const connex = window.connex;
  if (!connex) {
    throw new Error("VeWorld not connected");
  }

  // Verify testnet
  if (connex.thor.genesis.id !== '0x000000000b2bce3c70bc649a02749e8687721b09ed2e15997f466536b20bb127') {
    throw new Error("Please connect to VeChain testnet");
  }

  try {
    console.log('Deploying contract...');
    const signedTx = await connex.vendor.sign('tx', [{
      to: null,
      value: '0',
      data: TestNFT.bytecode,
      gas: 2000000
    }]);

    const deployTx = await signedTx.request();
    console.log('Waiting for deployment confirmation...');
    
    const receipt = await connex.thor.transaction(deployTx.txid).getReceipt();
    if (!receipt.outputs || !receipt.outputs[0].contractAddress) {
      throw new Error('Deployment failed - no contract address');
    }

    const contractAddress = receipt.outputs[0].contractAddress;
    console.log('Contract deployed to:', contractAddress);

    // Verify contract code
    const code = await connex.thor.account(contractAddress).get();
    if (!code.code) {
      throw new Error('Contract code not found');
    }
    console.log('Contract verified ✓');

  } catch (error) {
    console.error('Deployment error:', error);
    process.exitCode = 1;
  }
}

main(); 