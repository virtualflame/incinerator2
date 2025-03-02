// Declare global VeChain types
declare global {
  interface Window {
    readonly connex: {
      thor: {
        genesis: {
          id: string;
        };
        transaction(txid: string): {
          getReceipt(): Promise<{
            outputs: Array<{
              contractAddress: string;
            }>;
          }>;
        };
        account(addr: string): {
          get(): Promise<{
            balance: string;
            energy: string;
            code?: string;
          }>;
        };
      };
      vendor: {
        sign(type: 'tx' | 'cert', msg: any): {
          request(): Promise<{
            annex?: {
              signer: string;
            };
            txid?: string;
          }>;
        };
      };
    };
    readonly vechain: any;
    readonly ethers: any;
  }
}

// Our app's network types
export type VeChainNetwork = 'mainnet' | 'testnet'

// Connection status type
export interface ConnectionStatus {
  isConnected: boolean
  address: string | null
  network: 'testnet'  // We only use testnet
}

// Add collection types
export interface NFTCollection {
  address: string
  name: string
  symbol: string
  totalSupply: number
}

// Make this a module
export {} 