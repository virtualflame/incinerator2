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
    return new Promise<void>((resolve, reject) => {
      // Check if already connected
      if (window.connex?.thor && window.connex?.vendor) {
        resolve()
        return
      }

      // Wait for VeWorld to be ready
      let attempts = 0
      const maxAttempts = 50
      const interval = setInterval(() => {
        attempts++

        // Check if VeWorld is ready
        if (window.vechain) {
          clearInterval(interval)
          
          // Listen for connect event
          window.vechain.on('connect', () => {
            if (window.connex?.thor) {
              resolve()
            }
          })

          // Request connection
          window.vechain.enable().catch((error: Error) => {
            reject(error)
          })
        }

        // Timeout after max attempts
        if (attempts >= maxAttempts) {
          clearInterval(interval)
          reject(new Error('VeWorld not detected'))
        }
      }, 100)
    })
  }

  public async connect(): Promise<ConnectionStatus> {
    try {
      // Wait for VeWorld and handle connection
      await this.waitForVeWorld()

      // Get user's address
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

      // Get VET and VTHO balances
      const account = await window.connex.thor.account(address).get()
      
      // Get B3TR balance (replace with actual B3TR contract address)
      const B3TR_CONTRACT = '0x...' // Add your B3TR contract address
      const tokenABI = {
        "constant": true,
        "inputs": [{"name": "_owner","type": "address"}],
        "name": "balanceOf",
        "outputs": [{"name": "balance","type": "uint256"}],
        "type": "function"
      }

      const b3trBalance = await window.connex.thor
        .account(B3TR_CONTRACT)
        .method(tokenABI)
        .call(address)

      return {
        vet: account.balance || '0',
        vtho: account.energy || '0',
        b3tr: b3trBalance?.decoded?.balance || '0'
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
    return this.status.isConnected && !!this.status.address
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