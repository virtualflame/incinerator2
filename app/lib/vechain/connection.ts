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

  private connectionListeners: ((status: ConnectionStatus) => void)[] = []

  public onConnect(callback: (status: ConnectionStatus) => void) {
    this.connectionListeners.push(callback)
  }

  private notifyListeners() {
    this.connectionListeners.forEach(callback => callback(this.status))
  }

  // Simplified check
  public isWalletAvailable(): boolean {
    return typeof window !== 'undefined' && !!window.vechain
  }

  private async waitForVeWorld(): Promise<void> {
    return new Promise((resolve, reject) => {
      let attempts = 0
      const maxAttempts = 50
      const checkInterval = 100 // ms

      const interval = setInterval(() => {
        attempts++
        
        // Check for both VeWorld and Connex
        if (window.veworld && window.connex?.thor) {
          clearInterval(interval)
          resolve()
          return
        }

        // Timeout after 5 seconds
        if (attempts >= maxAttempts) {
          clearInterval(interval)
          reject(new Error('VeWorld not detected. Please install VeWorld extension.'))
        }
      }, checkInterval)
    })
  }

  public async connect(): Promise<ConnectionStatus> {
    try {
      console.log('Waiting for VeWorld...')
      await this.waitForVeWorld()
      console.log('VeWorld detected')

      // Request certificate to get address
      const cert = await window.connex.vendor.sign('cert', {
        purpose: 'identification',
        payload: {
          type: 'text',
          content: 'Connect to VFS Incinerator'
        }
      }).request()

      if (!cert?.annex?.signer) {
        throw new Error('Failed to get wallet address')
      }

      // Update status
      this.status = {
        isConnected: true,
        address: cert.annex.signer,
        network: 'testnet'
      }

      console.log('Connected with address:', this.status.address)
      this.notifyListeners()
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

  public disconnect() {
    this.status = {
      isConnected: false,
      address: null,
      network: 'testnet'
    }
  }

  public async getBalance(address: string): Promise<{
    vet: string,
    vtho: string,
    b3tr: string
  }> {
    try {
      if (!window.connex?.thor) {
        throw new Error('Not connected to VeChain')
      }

      console.log('Fetching balance for:', address)

      const account = await window.connex.thor.account(address).get()
      
      const balances = {
        vet: account.balance || '0',
        vtho: account.energy || '0',
        b3tr: '0' // We'll add B3TR later
      }

      console.log('Balances:', balances)
      return balances

    } catch (error) {
      console.error('Balance check failed:', error)
      return { vet: '0', vtho: '0', b3tr: '0' }
    }
  }

  // Get current status
  public getStatus(): ConnectionStatus {
    return this.status
  }

  // Add method to check if we're connected
  public isConnected(): boolean {
    return this.status.isConnected && !!this.status.address && !!window.connex?.thor
  }

  // Add method to get current address
  public getAddress(): string | null {
    return this.status.address
  }

  public async verifyTestnet(): Promise<boolean> {
    if (!window.connex) return false
    return window.connex.thor.genesis.id === TESTNET_CONFIG.genesis
  }
}

// Add VeWorld types
declare global {
  interface Window {
    veworld?: any;
    connex?: {
      thor: any;
      vendor: any;
    };
  }
}

// Export a single instance
export const vechain = new VeChainConnection() 