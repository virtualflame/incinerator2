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
    try {
      if (!this.isWalletAvailable()) {
        throw new Error('VeWorld wallet not found. Please install VeWorld extension.')
      }

      // Request account access
      const accounts = await window.vechain.request({
        method: 'eth_requestAccounts'
      })

      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts found')
      }

      this.status = {
        isConnected: true,
        address: accounts[0],
        network: 'testnet'
      }

      return this.status

    } catch (error) {
      console.error('Wallet connection error:', error)
      return this.status
    }
  }

  // Get wallet balance
  public async getBalance(address: string): Promise<{
    vet: string,
    vtho: string
  }> {
    try {
      const connex = window.connex
      const account = await connex.thor.account(address).get()
      
      return {
        vet: (parseInt(account.balance) / 1e18).toFixed(2),
        vtho: (parseInt(account.energy) / 1e18).toFixed(2)
      }
    } catch (error) {
      console.error('Balance check failed:', error)
      return { vet: '0', vtho: '0' }
    }
  }

  // Get current status
  public getStatus(): ConnectionStatus {
    return this.status
  }

  async getAddress(): Promise<string> {
    const status = await this.connect()
    if (!status.address) throw new Error('No address available')
    return status.address
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