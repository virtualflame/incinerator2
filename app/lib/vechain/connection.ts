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

  private async ensureConnected(): Promise<void> {
    if (!this.status.isConnected) {
      await this.connect()
    }
  }

  private async waitForConnex(timeoutMs = 10000): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof window !== 'undefined' && window.connex) {
        resolve()
        return
      }

      const startTime = Date.now()
      const interval = setInterval(() => {
        if (typeof window !== 'undefined' && window.connex) {
          clearInterval(interval)
          resolve()
          return
        }

        if (Date.now() - startTime > timeoutMs) {
          clearInterval(interval)
          reject(new Error('VeWorld not found. Please install VeWorld extension.'))
        }
      }, 500)
    })
  }

  // Check if VeWorld is available
  public isWalletAvailable(): boolean {
    return typeof window !== 'undefined' && 
      typeof window.vechain !== 'undefined'
  }

  // Connect to VeWorld
  public async connect(): Promise<ConnectionStatus> {
    try {
      await this.waitForConnex()
      
      // Now we can safely use window.connex
      const connex = window.connex
      
      // Verify testnet
      if (connex.thor.genesis.id !== TESTNET_CONFIG.genesis) {
        throw new Error('Please connect to VeChain testnet')
      }

      // Get address
      const cert = await connex.vendor.sign('cert', {
        purpose: 'identification',
        payload: {
          type: 'text',
          content: 'Connect to app'
        }
      }).request()

      if (!cert.annex?.signer) {
        throw new Error('Failed to get wallet address')
      }

      this.status = {
        isConnected: true,
        address: cert.annex.signer,
        network: 'testnet'
      }

      return this.status

    } catch (error) {
      this.status = {
        isConnected: false,
        address: null,
        network: 'testnet'
      }
      throw error
    }
  }

  // Get wallet balance
  public async getBalance(address: string): Promise<{
    vet: string,
    vtho: string
  }> {
    try {
      await this.ensureConnected()
      await this.waitForConnex()

      if (!window.connex?.thor) {
        throw new Error('VeWorld not properly initialized')
      }

      const account = await window.connex.thor.account(address).get()
      return {
        vet: account.balance,
        vtho: account.energy
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
    try {
      await this.ensureConnected()
      await this.waitForConnex()

      if (!window.connex?.vendor) {
        throw new Error('VeWorld not properly initialized')
      }

      const cert = await window.connex.vendor.sign('cert', {
        purpose: 'identification',
        payload: {
          type: 'text',
          content: 'Get address'
        }
      }).request()

      if (!cert.annex?.signer) {
        throw new Error('Failed to get wallet address')
      }

      return cert.annex.signer
    } catch (error) {
      console.error('Failed to get address:', error)
      throw error
    }
  }

  public async verifyTestnet(): Promise<boolean> {
    if (!window.connex) return false
    return window.connex.thor.genesis.id === TESTNET_CONFIG.genesis
  }

  public async deployContract(bytecode: string, constructorData: string): Promise<string> {
    try {
      await this.ensureConnected()
      await this.waitForConnex()

      if (!window.connex?.vendor) {
        throw new Error('VeWorld not properly initialized')
      }

      if (!await this.verifyTestnet()) {
        throw new Error('Please connect to VeChain testnet')
      }

      const deployTx = await window.connex.vendor.sign('tx', [{
        to: null,
        value: '0',
        data: bytecode + constructorData.slice(2),
        gas: 2000000
      }]).request()

      if (!deployTx.txid) {
        throw new Error('Failed to get transaction ID')
      }

      const receipt = await window.connex.thor.transaction(deployTx.txid).getReceipt()
      if (!receipt.outputs?.[0]?.contractAddress) {
        throw new Error('Deployment failed')
      }

      return receipt.outputs[0].contractAddress
    } catch (error) {
      console.error('Contract deployment failed:', error)
      throw error
    }
  }
}

// Export a single instance
export const vechain = new VeChainConnection() 