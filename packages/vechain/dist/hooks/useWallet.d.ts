import { ConnectionStatus } from '../types';
export declare function useWallet(): {
    connect: () => Promise<ConnectionStatus>;
    disconnect: () => void;
    isConnected: boolean;
    address: string | null;
    isLoading: boolean;
    error: Error | null;
};
