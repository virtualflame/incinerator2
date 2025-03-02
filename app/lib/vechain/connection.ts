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

  // Simplified check
  public isWalletAvailable(): boolean {
    return typeof window !== 'undefined' && !!window.vechain
  }

  private async waitForVeWorld(): Promise<void> {
    return new Promise((resolve, reject) => {
      // Check for immediate availability
      if (window.connex?.thor && window.connex?.vendor) {
        resolve()
        return
      }

      // Force wallet popup by requesting connection
      if (window.vechain) {
        try {
          window.vechain.on('connect', () => {
            if (window.connex?.thor) {
              resolve()
            }
          })
          
          // This triggers the VeWorld popup
          window.vechain.enable()
        } catch (error) {
          reject(new Error('Please unlock VeWorld wallet'))
        }
      } else {
        reject(new Error('VeWorld not found'))
      }

      // Timeout after 30 seconds
      setTimeout(() => {
        reject(new Error('Connection timeout. Please try again.'))
      }, 30000)
    })
  }

  public async connect(): Promise<ConnectionStatus> {
    try {
      // This will trigger the VeWorld popup
      await this.waitForVeWorld()

      // After popup, check Connex
      if (!window.connex?.thor || !window.connex?.vendor) {
        throw new Error('Please accept the connection request in VeWorld')
      }

      // Verify testnet
      const genesis = window.connex.thor.genesis.id
      if (genesis !== '0x000000000b2bce3c70bc649a02749e8687721b09ed2e15997f466536b20bb127') {
        throw new Error('Please switch to VeChain testnet in VeWorld')
      }

      // Get user's address
      const cert = await window.connex.vendor.sign('cert', {
        purpose: 'identification',
        payload: {
          type: 'text',
          content: 'Connect to VFS Incinerator'
        }
      }).request()

      if (!cert?.annex?.signer) {
        throw new Error('Could not get wallet address')
      }

      this.status = {
        isConnected: true,
        address: cert.annex.signer,
        network: 'testnet'
      }

      return this.status

    } catch (error: any) {
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