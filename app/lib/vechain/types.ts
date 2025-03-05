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
    connex?: Connex;
  }
}

// Our app's network types
export type VeChainNetwork = 'mainnet' | 'testnet'

// Define VeChain types
export interface ConnectionStatus {
  isConnected: boolean;
  address: string | null;
  network: string;
}

export interface ConnexThor {
  genesis: {
    id: string;
  };
  account(addr: string): {
    get(): Promise<{
      balance: string;
      energy: string;
      hasCode?: boolean;
    }>;
  };
}

export interface ConnexVendor {
  sign(type: 'cert', params: {
    purpose: string;
    payload: {
      type: string;
      content: string;
    };
  }): {
    request(): Promise<{
      annex?: {
        signer?: string;
      };
    }>;
  };
}

export interface Connex {
  thor: ConnexThor;
  vendor: ConnexVendor;
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