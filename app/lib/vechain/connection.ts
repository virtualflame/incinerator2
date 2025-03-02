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

  // Check for VeWorld extension
  public isWalletAvailable(): boolean {
    try {
      // Check for both iFrame and Connex
      return !!(
        window?.document?.querySelector('iframe[id^="vechain-"]') &&
        typeof window?.connex !== 'undefined'
      )
    } catch {
      return false
    }
  }

  private async waitForVeWorld(): Promise<void> {
    return new Promise((resolve, reject) => {
      let attempts = 0
      const maxAttempts = 50 // 5 seconds total

      const checkConnex = () => {
        attempts++

        // Check if Connex is ready
        if (window?.connex?.thor && window?.connex?.vendor) {
          clearInterval(interval)
          resolve()
          return
        }

        // Give up after max attempts
        if (attempts >= maxAttempts) {
          clearInterval(interval)
          if (!window?.connex) {
            reject(new Error('VeWorld not found. Please install the extension.'))
          } else {
            reject(new Error('Please open and unlock your VeWorld wallet.'))
          }
        }
      }

      // Check every 100ms
      const interval = setInterval(checkConnex, 100)

      // Initial check
      checkConnex()
    })
  }

  public async connect(): Promise<ConnectionStatus> {
    try {
      // Ensure Connex is ready
      await this.waitForVeWorld()

      // Get Connex instance
      const connex = window.connex
      if (!connex?.thor || !connex?.vendor) {
        throw new Error('VeWorld not properly initialized')
      }

      // Check network
      const genesis = connex.thor.genesis.id
      if (genesis !== '0x000000000b2bce3c70bc649a02749e8687721b09ed2e15997f466536b20bb127') {
        throw new Error('Please switch to VeChain testnet in VeWorld')
      }

      // Request wallet access
      const cert = await connex.vendor.sign('cert', {
        purpose: 'identification',
        payload: {
          type: 'text',
          content: 'Connect to VFS Incinerator'
        }
      }).request()

      if (!cert?.annex?.signer) {
        throw new Error('Could not get wallet address')
      }

      // Update status
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