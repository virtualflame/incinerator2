// Import our types and utilities
import { ConnectionStatus } from './types'

// Simplified connection class
export class VeChainConnection {
  private status: ConnectionStatus = {
    isConnected: false,
    address: null,
    network: 'testnet'
  }

  // Check if VeWorld is available
  public isWalletAvailable(): boolean {
    return typeof window !== 'undefined' && 
      typeof window.vechain !== 'undefined'
  }

  // Connect to VeWorld
  public async connect(): Promise<ConnectionStatus> {
    try {
      if (!this.isWalletAvailable()) {
        throw new Error('VeWorld wallet not found. Please install VeWorld extension.')
      }

      // Request account access
      const accounts = await window.vechain.request({
        method: 'eth_requestAccounts'
      })

      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts found')
      }

      this.status = {
        isConnected: true,
        address: accounts[0],
        network: 'testnet'
      }

      return this.status

    } catch (error) {
      console.error('Wallet connection error:', error)
      return this.status
    }
  }

  // Get wallet balance
  public async getBalance(address: string): Promise<{
    vet: string,
    vtho: string
  }> {
    try {
      const connex = window.connex
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

  // Get current status
  public getStatus(): ConnectionStatus {
    return this.status
  }

  async getAddress(): Promise<string> {
    const status = await this.connect()
    if (!status.address) throw new Error('No address available')
    return status.address
  }
}

// Export a single instance
export const vechain = new VeChainConnection() 