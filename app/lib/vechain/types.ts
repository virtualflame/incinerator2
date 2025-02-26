// Declare global VeChain types
declare global {
  interface Window {
    readonly connex: {
      thor: {
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
          }>;
          method(abi: any): {
            call(addr: string): Promise<{
              decoded: any[];
            }>;
          };
        };
      };
      vendor: {
        sign(type: 'tx', clauses: Array<{
          to: string | null;
          value: string;
          data: string;
          gas?: number;
        }>): {
          request(): Promise<{
            txid: string;
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