// Define base types
export type VeChainNetwork = 'mainnet' | 'testnet'

export interface ConnectionStatus {
  isConnected: boolean;
  address: string | null;
  network: string;
}

// Define Connex interface
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

// Extend Window interface
declare global {
  interface Window {
    readonly vechain: any;
    readonly ethers: any;
    readonly connex?: {
      thor: ConnexThor;
      vendor: ConnexVendor;
    };
  }
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