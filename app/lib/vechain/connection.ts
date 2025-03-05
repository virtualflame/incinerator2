// Import our types and utilities
import { ConnectionStatus, Connex } from './types'

// Add testnet configuration
const TESTNET_CONFIG = {
  node: 'https://testnet.veblocks.net',
  network: 'test',
  genesis: '0x000000000b2bce3c70bc649a02749e8687721b09ed2e15997f466536b20bb127'
}

export class VeChainConnection {
  private status: ConnectionStatus = {
    isConnected: false,
    address: null,
    network: 'testnet'
  }

  private connectionListeners: ((status: ConnectionStatus) => void)[] = []

  public onConnect(callback: (status: ConnectionStatus) => void) {
    this.connectionListeners.push(callback)
    if (this.isConnected()) {
      callback(this.status)
    }
  }

  private notifyListeners() {
    this.connectionListeners.forEach(callback => callback(this.status))
  }

  public isWalletAvailable(): boolean {
    return typeof window !== 'undefined' && !!window.connex?.thor
  }

  private async waitForConnex(): Promise<void> {
    return new Promise((resolve, reject) => {
      // First check if already available
      if (typeof window !== 'undefined' && window.connex?.thor) {
        resolve()
        return
      }

      // If not available, wait for injection
      let attempts = 0
      const maxAttempts = 100 // Increased max attempts
      const checkInterval = 100 // ms

      const checkForConnex = () => {
        if (typeof window !== 'undefined' && window.connex?.thor) {
          clearInterval(interval)
          resolve()
          return
        }

        attempts++
        if (attempts >= maxAttempts) {
          clearInterval(interval)
          reject(new Error('VeWorld wallet not detected. Please install VeWorld and refresh the page.'))
        }
      }

      // Check immediately
      checkForConnex()
      
      // Then check periodically
      const interval = setInterval(checkForConnex, checkInterval)

      // Cleanup after 10 seconds
      setTimeout(() => {
        clearInterval(interval)
        reject(new Error('VeWorld connection timeout. Please refresh and try again.'))
      }, 10000)
    })
  }

  public async connect(): Promise<ConnectionStatus> {
    try {
      console.log('Waiting for VeWorld...')
      await this.waitForConnex()
      console.log('VeWorld detected')

      if (!window.connex?.thor) {
        throw new Error('VeWorld not properly initialized')
      }

      // Check network
      const genesis = window.connex.thor.genesis
      const isMainnet = genesis.id === '0x00000000851caf3cfdb6e899cf5958bfb1ac3413d346d43539627e6be7ec1b4a'
      
      console.log('Getting user address...')
      // Get user's address
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

      console.log('Connected with address:', certResponse.annex.signer)

      this.status = {
        isConnected: true,
        address: certResponse.annex.signer,
        network: isMainnet ? 'mainnet' : 'testnet'
      }

      this.notifyListeners()
      await this.updateBalances() // Auto-update balances on connect
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

  private async updateBalances() {
    if (!this.status.address) return
    await this.getBalance(this.status.address)
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

  public disconnect() {
    this.status = {
      isConnected: false,
      address: null,
      network: 'testnet'
    }
    this.notifyListeners()
  }

  public isConnected(): boolean {
    return this.status.isConnected && !!this.status.address && !!window.connex?.thor
  }

  public getAddress(): string | null {
    return this.status.address
  }

  public getStatus(): ConnectionStatus {
    return this.status
  }

  public async verifyTestnet(): Promise<boolean> {
    if (!window.connex) return false
    return window.connex.thor.genesis.id === TESTNET_CONFIG.genesis
  }
}

export const vechain = new VeChainConnection() 