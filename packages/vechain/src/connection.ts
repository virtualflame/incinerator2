import { ConnectionStatus } from './types'

// Add testnet configuration
const TESTNET_CONFIG = {
  node: 'https://testnet.veblocks.net',
  network: 'test',
  genesis: '0x000000000b2bce3c70bc649a02749e8687721b09ed2e15997f466536b20bb127'
}

// Update constants for better timing
const VEWORLD_CHECK_ATTEMPTS = 50
const VEWORLD_CHECK_INTERVAL = 200 // Increased interval

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
    // First check if wallet is installed
    if (!window.vechain) {
      throw new Error('VeWorld wallet not detected. Please install VeWorld wallet extension.')
    }

    // Then wait for initialization
    for (let i = 1; i <= VEWORLD_CHECK_ATTEMPTS; i++) {
      // Check if wallet is unlocked and initialized
      if (window.connex?.thor) {
        // Additional verification
        try {
          const chainTag = await window.connex.thor.genesis.id
          if (chainTag) {
            return // Successfully initialized
          }
        } catch (e) {
          console.log('Waiting for full initialization...')
        }
      }
      
      console.log(`Waiting for VeWorld to unlock... (${i}/${VEWORLD_CHECK_ATTEMPTS})`)
      await new Promise(resolve => setTimeout(resolve, VEWORLD_CHECK_INTERVAL))
    }

    throw new Error('Please unlock your VeWorld wallet and refresh the page')
  }

  public async connect(): Promise<ConnectionStatus> {
    try {
      // Clear any existing state
      this.disconnect()
      
      await this.waitForVeWorld()

      // Verify connection is ready
      if (!window.connex?.thor) {
        throw new Error('VeWorld not properly initialized. Please unlock your wallet.')
      }

      // Get user's address with better error handling
      try {
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
          network: 'testnet'
        }

        this.notifyListeners()
        await this.updateBalances() // Auto-update balances on connect
        return this.status
      } catch (err) {
        throw new Error('Connection request was rejected. Please try again.')
      }

    } catch (error) {
      console.error('Connection error:', error)
      this.disconnect() // Clean up on error
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