import { ConnectionStatus } from './types';
export declare class VeChainConnection {
    private status;
    private connectionListeners;
    onConnect(callback: (status: ConnectionStatus) => void): void;
    private notifyListeners;
    isWalletAvailable(): boolean;
    private waitForVeWorld;
    connect(): Promise<ConnectionStatus>;
    private updateBalances;
    getBalance(address: string): Promise<{
        vet: string;
        vtho: string;
        b3tr: string;
    }>;
    disconnect(): void;
    isConnected(): boolean;
    getAddress(): string | null;
    getStatus(): ConnectionStatus;
    verifyTestnet(): Promise<boolean>;
}
export declare const vechain: VeChainConnection;
