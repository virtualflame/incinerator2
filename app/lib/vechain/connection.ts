// Import our types and utilities
import { ConnectionStatus } from './types'

// Add testnet configuration
const TESTNET_CONFIG = {
  node: 'https://testnet.veblocks.net',
  network: 'test',
  genesis: '0x000000000b2bce3c70bc649a02749e8687721b09ed2e15997f466536b20bb127'
}

// Simplified connection class
export class VeChainConnection {
  private status: ConnectionStatus = {
    isConnected: false,
    address: null,
    network: 'testnet'  // Default to testnet
  }

  // Check if VeWorld is available
  public isWalletAvailable(): boolean {
    return typeof window !== 'undefined' && 
      typeof window.vechain !== 'undefined'
  }

  // Connect to VeWorld
  public async connect(): Promise<ConnectionStatus> {
    // Wait for window.connex to be available
    let attempts = 0
    while (!window.connex && attempts < 10) {
      await new Promise(resolve => setTimeout(resolve, 500))
      attempts++
    }

    if (!window.connex) {
      throw new Error('VeWorld not found. Please install VeWorld extension.')
    }

    // Verify testnet
    if (window.connex.thor.genesis.id !== '0x000000000b2bce3c70bc649a02749e8687721b09ed2e15997f466536b20bb127') {
      throw new Error('Please connect to VeChain testnet')
    }

    // Get address
    const cert = await window.connex.vendor.sign('cert', {
      purpose: 'identification',
      payload: {
        type: 'text',
        content: 'Connect to app'
      }
    }).request()

    return {
      isConnected: true,
      address: cert.annex.signer,
      network: 'testnet'
    }
  }

  // Get wallet balance
  public async getBalance(address: string): Promise<{
    vet: string,
    vtho: string
  }> {
    if (!window.connex) throw new Error('Not connected')
    
    const account = await window.connex.thor.account(address).get()
    return {
      vet: account.balance,
      vtho: account.energy
    }
  }

  // Get current status
  public getStatus(): ConnectionStatus {
    return this.status
  }

  async getAddress(): Promise<string> {
    const cert = await window.connex.vendor.sign('cert', {
      purpose: 'identification',
      payload: {
        type: 'text',
        content: 'Get address'
      }
    }).request()
    return cert.annex.signer
  }

  public async verifyTestnet(): Promise<boolean> {
    if (!window.connex) return false;
    return window.connex.thor.genesis.id === TESTNET_CONFIG.genesis;
  }

  public async deployContract(bytecode: string, constructorData: string): Promise<string> {
    const connex = window.connex;
    if (!connex) throw new Error('VeWorld not connected');

    if (!await this.verifyTestnet()) {
      throw new Error('Please connect to VeChain testnet');
    }

    const deployTx = await connex.vendor.sign('tx', [{
      to: null,
      value: '0',
      data: bytecode + constructorData.slice(2),
      gas: 2000000
    }]).request();

    const receipt = await connex.thor.transaction(deployTx.txid).getReceipt();
    if (!receipt.outputs?.[0]?.contractAddress) {
      throw new Error('Deployment failed');
    }

    return receipt.outputs[0].contractAddress;
  }
}

// Export a single instance
export const vechain = new VeChainConnection() 