import { ConnectionStatus } from './types'

// Add testnet configuration
const TESTNET_CONFIG = {
  node: 'https://testnet.veblocks.net',
  network: 'test',
  genesis: '0x000000000b2bce3c70bc649a02749e8687721b09ed2e15997f466536b20bb127'
}

// Add timeout and better error messages
const VEWORLD_CHECK_ATTEMPTS = 50
const VEWORLD_CHECK_INTERVAL = 100 // ms

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

  private async waitForVeWorld(): Promise<void> {
    for (let i = 1; i <= VEWORLD_CHECK_ATTEMPTS; i++) {
      // Check for both vechain and connex
      if (window.vechain && window.connex?.thor) {
        return
      }
      
      // Log more specific status
      if (!window.vechain) {
        console.log(`Waiting for VeWorld extension... (${i}/${VEWORLD_CHECK_ATTEMPTS})`)
      } else if (!window.connex?.thor) {
        console.log(`Waiting for VeWorld initialization... (${i}/${VEWORLD_CHECK_ATTEMPTS})`)
      }
      
      await new Promise(resolve => setTimeout(resolve, VEWORLD_CHECK_INTERVAL))
    }

    // More specific error messages
    if (!window.vechain) {
      throw new Error('VeWorld wallet not detected. Please install VeWorld wallet extension.')
    } else if (!window.connex?.thor) {
      throw new Error('VeWorld not initialized. Please unlock your wallet and refresh.')
    }
    
    throw new Error('VeWorld connection failed. Please refresh and try again.')
  }

  public async connect(): Promise<ConnectionStatus> {
    try {
      await this.waitForVeWorld()
      
      // Additional check for thor
      if (!window.connex?.thor) {
        throw new Error('VeWorld not properly initialized. Please unlock your wallet.')
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