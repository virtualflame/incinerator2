import { Connex } from '@vechain/connex';

async function main() {
  const connex = new Connex({
    node: 'https://testnet.veblocks.net',
    network: 'test'
  });

  // This will prompt VeWorld for approval
  const deployTx = await connex.vendor.sign('tx', [{
    // deployment transaction details
  }]);
} 