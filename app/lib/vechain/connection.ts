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
}

// Export a single instance to use throughout the app
export const vechain = new VeChainConnection() 