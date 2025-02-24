// Import our types and utilities
import { ConnectionStatus, VeChainNetwork } from './types'
import { getCurrentNetwork, getInitialStatus } from './utils'

// Class to manage VeChain wallet connections
export class VeChainConnection {
  // Store our connection status
  private status: ConnectionStatus
  
  constructor() {
    // Start with initial disconnected state
    this.status = getInitialStatus()
  }

  // Check if VeWorld wallet is available
  public isWalletAvailable(): boolean {
    // Check if we're in browser and Sync2 or VeWorld is available
    return typeof window !== 'undefined' && 
      (typeof window.vechain !== 'undefined' || 
       typeof window.thor !== 'undefined')
  }

  // Connect to wallet
  public async connect(): Promise<ConnectionStatus> {
    try {
      // Make sure we have a wallet
      if (!this.isWalletAvailable()) {
        throw new Error('No VeChain wallet found. Please install VeWorld.')
      }

      // Request connection from wallet
      const connex = new window.Connex({
        node: process.env.NEXT_PUBLIC_VECHAIN_NODE,
        network: getCurrentNetwork()
      })

      // Request wallet certificate
      const certResponse = await connex.vendor.sign('cert', {
        purpose: 'identification',
        payload: {
          type: 'text',
          content: 'Connect to VFS Incinerator'
        }
      })

      // Update our status
      this.status = {
        isConnected: true,
        address: certResponse.annex.signer,
        network: getCurrentNetwork()
      }

      return this.status

    } catch (error) {
      console.error('Wallet connection error:', error)
      return getInitialStatus()
    }
  }

  // Get current connection status
  public getStatus(): ConnectionStatus {
    return this.status
  }

  // Disconnect wallet
  public disconnect(): ConnectionStatus {
    this.status = getInitialStatus()
    return this.status
  }

  // Check if user is on the correct network
  public async checkNetwork(): Promise<boolean> {
    try {
      const connex = new window.Connex({
        node: process.env.NEXT_PUBLIC_VECHAIN_NODE,
        network: getCurrentNetwork()
      })
      
      // Get network info
      const block = await connex.thor.block().get()
      const expectedGenesisId = getCurrentNetwork() === 'testnet'
        ? '0x00000000851caf3cfdb6e899cf5958bfb1ac3413d346d43539627e6be7ec1b4a'  // Testnet
        : '0x00000000851caf3cfdb6e899cf5958bfb1ac3413d346d43539627e6be7ec1b4a'  // Mainnet
      
      return block.genesis === expectedGenesisId
    } catch (error) {
      console.error('Network check failed:', error)
      return false
    }
  }

  // Get wallet balance
  public async getBalance(address: string): Promise<{
    vet: string,
    vtho: string
  }> {
    try {
      const connex = new window.Connex({
        node: process.env.NEXT_PUBLIC_VECHAIN_NODE,
        network: getCurrentNetwork()
      })

      const account = await connex.thor.account(address).get()
      
      return {
        vet: (parseInt(account.balance) / 1e18).toFixed(2),
        vtho: (parseInt(account.energy) / 1e18).toFixed(2)
      }
    } catch (error) {
      console.error('Balance check failed:', error)
      return { vet: '0', vtho: '0' }
    }
  }

  // Auto-reconnect if previously connected
  public async autoConnect(): Promise<ConnectionStatus> {
    try {
      // Check if we were previously connected
      const savedAddress = localStorage.getItem('vechain_address')
      if (savedAddress) {
        await this.connect()
        return this.status
      }
      return getInitialStatus()
    } catch (error) {
      console.error('Auto-connect failed:', error)
      return getInitialStatus()
    }
  }

  // Save connection state
  private saveConnection() {
    if (this.status.address) {
      localStorage.setItem('vechain_address', this.status.address)
    }
  }

  // Clear saved connection
  private clearConnection() {
    localStorage.removeItem('vechain_address')
  }
}

// Export a single instance to use throughout the app
export const vechain = new VeChainConnection() 