import { ConnectionStatus, VeChainNetwork } from './types'

// This function checks which network we're using (testnet or mainnet)
// It reads from our environment variables (set in .env.local)
export const getCurrentNetwork = (): VeChainNetwork => {
  // If NEXT_PUBLIC_VECHAIN_NETWORK is 'testnet', return 'testnet', otherwise return 'mainnet'
  // This is a ternary operator: condition ? valueIfTrue : valueIfFalse
  return process.env.NEXT_PUBLIC_VECHAIN_NETWORK === 'testnet' 
    ? 'testnet' 
    : 'mainnet'
}

// This function makes long wallet addresses more readable
// Example: 0x742d35Cc6634C0532925a3b844Bc454e4438f44e -> 0x742d...f44e
export const formatAddress = (address: string): string => {
  // If no address provided, return empty string
  if (!address) return ''
  // Take first 6 characters + ... + last 4 characters
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

// This function creates the initial state for our wallet connection
// We use this when the app first loads or when wallet disconnects
export const getInitialStatus = (): ConnectionStatus => {
  return {
    isConnected: false,      // Start disconnected
    address: null,           // No wallet address
    network: getCurrentNetwork()  // But we know which network we're on
  }
} 