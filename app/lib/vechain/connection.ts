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
    network: 'testnet'
  }

  // VeWorld specific check
  public isWalletAvailable(): boolean {
    try {
      // VeWorld injects window.vechain first, then connex
      return !!(window?.vechain)
    } catch {
      return false
    }
  }

  private async waitForVeWorld(): Promise<void> {
    return new Promise((resolve, reject) => {
      // Check for initial vechain object
      if (window?.vechain) {
        // Wait for Connex to be fully injected
        const checkConnex = setInterval(() => {
          if (window.connex?.thor && window.connex?.vendor) {
            clearInterval(checkConnex)
            resolve()
          }
        }, 100)

        // Timeout after 5 seconds
        setTimeout(() => {
          clearInterval(checkConnex)
          reject(new Error('VeWorld not responding. Please unlock your wallet.'))
        }, 5000)
      } else {
        reject(new Error('VeWorld not found. Please install VeWorld extension.'))
      }
    })
  }

  public async connect(): Promise<ConnectionStatus> {
    try {
      // Wait for full VeWorld initialization
      await this.waitForVeWorld()

      // Verify we're on testnet
      const genesis = window.connex?.thor?.genesis?.id
      if (genesis !== '0x000000000b2bce3c70bc649a02749e8687721b09ed2e15997f466536b20bb127') {
        throw new Error('Please switch to VeChain testnet in VeWorld')
      }

      // Request wallet connection
      const cert = await window.connex.vendor.sign('cert', {
        purpose: 'identification',
        payload: {
          type: 'text',
          content: 'Connect to VFS Incinerator'
        }
      }).request()

      if (!cert?.annex?.signer) {
        throw new Error('Could not get wallet address. Please try again.')
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

  public async getBalance(address: string): Promise<{
    vet: string,
    vtho: string
  }> {
    if (!window.connex?.thor) {
      throw new Error('VeWorld not initialized')
    }

    const account = await window.connex.thor.account(address).get()
    return {
      vet: account.balance || '0',
      vtho: account.energy || '0'
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