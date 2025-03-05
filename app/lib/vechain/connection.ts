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

// Define Connex types based on official docs
interface ConnexThor {
  genesis: {
    id: string;
  };
  account(addr: string): {
    get(): Promise<{
      balance: string;
      energy: string;
      hasCode: boolean;
    }>;
  };
  transaction(txid: string): {
    get(): Promise<any>;
    getReceipt(): Promise<{
      outputs: { contractAddress: string; }[];
    }>;
  };
}

interface ConnexVendor {
  sign(type: 'cert', params: {
    purpose: string;
    payload: {
      type: string;
      content: string;
    };
  }): {
    request(): Promise<{
      annex?: {
        signer?: string;
      };
    }>;
  };
}

interface Connex {
  thor: ConnexThor;
  vendor: ConnexVendor;
}

declare global {
  interface Window {
    connex: Connex;
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

  private async waitForConnex(): Promise<void> {
    return new Promise((resolve, reject) => {
      // Check if Connex is already available
      if (window.connex?.thor) {
        resolve()
        return
      }

      // Wait for Connex to be injected by VeWorld
      const maxAttempts = 50
      let attempts = 0

      const interval = setInterval(() => {
        if (window.connex?.thor) {
          clearInterval(interval)
          resolve()
          return
        }

        attempts++
        if (attempts >= maxAttempts) {
          clearInterval(interval)
          reject(new Error('Please install VeWorld wallet extension'))
        }
      }, 100)
    })
  }

  public async connect(): Promise<ConnectionStatus> {
    try {
      await this.waitForConnex()

      // Get network info
      const genesis = window.connex.thor.genesis
      const network = genesis.id === '0x00000000851caf3cfdb6e899cf5958bfb1ac3413d346d43539627e6be7ec1b4a' 
        ? 'mainnet' 
        : 'testnet'

      // Request user certificate
      const certResponse = await window.connex.vendor
        .sign('cert', {
          purpose: 'identification',
          payload: {
            type: 'text',
            content: 'Connect to VFS Incinerator'
          }
        })
        .request()

      if (!certResponse?.annex?.signer) {
        throw new Error('Failed to get wallet address')
      }

      // Update connection status
      this.status = {
        isConnected: true,
        address: certResponse.annex.signer,
        network
      }

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

      const account = await window.connex.thor.account(address).get()
      
      return {
        vet: account.balance || '0',
        vtho: account.energy || '0',
        b3tr: '0' // Will implement later
      }
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

// Export a single instance
export const vechain = new VeChainConnection() 