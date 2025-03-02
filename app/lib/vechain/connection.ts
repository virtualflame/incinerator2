// Import our types and utilities
import { ConnectionStatus } from './types'

// Add testnet configuration (from VeChain Kit docs)
const TESTNET_CONFIG = {
  node: 'https://testnet.veblocks.net',
  network: 'test',
  genesis: '0x000000000b2bce3c70bc649a02749e8687721b09ed2e15997f466536b20bb127',
  // Add Sync Config
  sync: {
    enable: true,
    interval: 10000
  }
}

// Simplified connection class
export class VeChainConnection {
  private status: ConnectionStatus = {
    isConnected: false,
    address: null,
    network: 'testnet'  // Default to testnet
  }

  // Improved wallet check based on VeChain Kit
  public isWalletAvailable(): boolean {
    if (typeof window === 'undefined') return false
    return !!(window.connex?.thor && window.connex?.vendor)
  }

  private async waitForVeWorld(): Promise<void> {
    return new Promise((resolve, reject) => {
      // Check for full Connex initialization
      if (window.connex?.thor && window.connex?.vendor) {
        resolve()
        return
      }

      let attempts = 0
      const interval = setInterval(() => {
        attempts++
        
        // Check for complete Connex initialization
        if (window.connex?.thor && window.connex?.vendor) {
          clearInterval(interval)
          resolve()
          return
        }

        // Timeout after 20 attempts (10 seconds)
        if (attempts > 20) {
          clearInterval(interval)
          reject(new Error('VeWorld wallet not detected. Please install the extension.'))
        }
      }, 500)
    })
  }

  // Connect to VeWorld
  public async connect(): Promise<ConnectionStatus> {
    try {
      // Check for wallet
      if (!this.isWalletAvailable()) {
        throw new Error('Please install VeWorld wallet extension')
      }

      // Wait for initialization
      await this.waitForVeWorld()

      // Get Connex instance
      const connex = window.connex
      if (!connex) {
        throw new Error('VeWorld not properly initialized')
      }

      // Verify testnet
      if (connex.thor.genesis.id !== TESTNET_CONFIG.genesis) {
        throw new Error('Please switch to VeChain testnet')
      }

      // Request connection
      const cert = await connex.vendor.sign('cert', {
        purpose: 'identification',
        payload: {
          type: 'text',
          content: 'Connect to VFS Incinerator'
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
      console.error('Connection error:', error)
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
      await this.waitForVeWorld()
      
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
      await this.waitForVeWorld()

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
}

// Export a single instance
export const vechain = new VeChainConnection() 