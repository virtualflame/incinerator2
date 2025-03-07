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
    // First check if we're in a browser
    if (typeof window === 'undefined') {
      throw new Error('Cannot connect to VeWorld in a non-browser environment')
    }

    // Check for wallet extension
    if (!window.vechain) {
      console.log('VeWorld extension not found')
      throw new Error('Please install VeWorld wallet extension: https://vechain.github.io/veworld/')
    }

    console.log('VeWorld extension found, attempting to connect...')

    // Try to trigger the wallet popup
    try {
      // This should trigger the VeWorld popup
      await window.vechain.thor?.enable()
      console.log('Wallet popup triggered')
    } catch (e) {
      console.log('Failed to trigger wallet popup:', e)
      throw new Error('Please unlock your VeWorld wallet to continue')
    }

    // Then wait for initialization
    for (let i = 1; i <= VEWORLD_CHECK_ATTEMPTS; i++) {
      if (window.connex?.thor) {
        try {
          const chainTag = await window.connex.thor.genesis.id
          console.log('Connected to chain:', chainTag)
          return
        } catch (e) {
          console.log('Waiting for full initialization...', e)
        }
      }
      
      console.log(`Waiting for VeWorld to initialize... (${i}/${VEWORLD_CHECK_ATTEMPTS})`)
      await new Promise(resolve => setTimeout(resolve, VEWORLD_CHECK_INTERVAL))
    }

    throw new Error('VeWorld initialization timed out. Please try again.')
  }

  public async connect(): Promise<ConnectionStatus> {
    try {
      console.log('Starting wallet connection...')
      
      // Clear any existing state
      this.disconnect()
      
      await this.waitForVeWorld()
      console.log('VeWorld initialized')

      // Verify connection is ready
      if (!window.connex?.thor) {
        throw new Error('VeWorld not properly initialized. Please unlock your wallet.')
      }

      // Get user's address with better error handling
      try {
        console.log('Requesting wallet connection...')
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
        await this.updateBalances()
        return this.status

      } catch (err) {
        console.error('Connection request failed:', err)
        throw new Error('Connection request was rejected. Please try again.')
      }

    } catch (error) {
      console.error('Connection error:', error)
      this.disconnect()
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
    if (!window.connex) return true // Default to testnet
    const genesisId = await window.connex.thor.genesis.id
    return genesisId === TESTNET_CONFIG.genesis
  }
}

export const vechain = new VeChainConnection() 