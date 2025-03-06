export type VeChainNetwork = 'mainnet' | 'testnet';
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
declare global {
    interface Window {
        vechain: any;
        connex?: Connex;
    }
}
export {};
