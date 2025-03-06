"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.vechain = exports.VeChainConnection = void 0;
// Add testnet configuration
const TESTNET_CONFIG = {
    node: 'https://testnet.veblocks.net',
    network: 'test',
    genesis: '0x000000000b2bce3c70bc649a02749e8687721b09ed2e15997f466536b20bb127'
};
class VeChainConnection {
    constructor() {
        this.status = {
            isConnected: false,
            address: null,
            network: 'testnet'
        };
        this.connectionListeners = [];
    }
    onConnect(callback) {
        this.connectionListeners.push(callback);
        if (this.isConnected()) {
            callback(this.status);
        }
    }
    notifyListeners() {
        this.connectionListeners.forEach(callback => callback(this.status));
    }
    isWalletAvailable() {
        return typeof window !== 'undefined' && !!window.connex?.thor;
    }
    async waitForConnex() {
        return new Promise((resolve, reject) => {
            // First check if already available
            if (typeof window !== 'undefined' && window.connex?.thor && window.vechain) {
                resolve();
                return;
            }
            // If not available, wait for injection
            let attempts = 0;
            const maxAttempts = 50; // Reduced to avoid long waits
            const checkInterval = 200; // Increased interval
            const checkForConnex = () => {
                // Check for both VeWorld and Connex
                if (typeof window !== 'undefined' && window.connex?.thor && window.vechain) {
                    clearInterval(interval);
                    resolve();
                    return;
                }
                attempts++;
                console.log(`Checking for VeWorld... (${attempts}/${maxAttempts})`);
                if (attempts >= maxAttempts) {
                    clearInterval(interval);
                    if (!window.vechain) {
                        reject(new Error('VeWorld extension not found. Please install VeWorld and refresh.'));
                    }
                    else if (!window.connex?.thor) {
                        reject(new Error('VeWorld not initialized. Please unlock your wallet and refresh.'));
                    }
                    else {
                        reject(new Error('VeWorld connection failed. Please refresh and try again.'));
                    }
                }
            };
            // Check immediately
            checkForConnex();
            // Then check periodically
            const interval = setInterval(checkForConnex, checkInterval);
            // Cleanup after 10 seconds
            setTimeout(() => {
                clearInterval(interval);
                reject(new Error('Connection timeout. Please refresh and try again.'));
            }, 10000);
        });
    }
    async connect() {
        try {
            console.log('Waiting for VeWorld...');
            await this.waitForConnex();
            console.log('VeWorld detected');
            if (!window.connex?.thor || !window.vechain) {
                throw new Error('VeWorld not properly initialized');
            }
            // Check network
            const genesis = window.connex.thor.genesis;
            const isMainnet = genesis.id === '0x00000000851caf3cfdb6e899cf5958bfb1ac3413d346d43539627e6be7ec1b4a';
            console.log('Getting user address...');
            // Get user's address
            const certResponse = await window.connex.vendor
                .sign('cert', {
                purpose: 'identification',
                payload: {
                    type: 'text',
                    content: 'Connect to VFS Incinerator'
                }
            })
                .request();
            if (!certResponse?.annex?.signer) {
                throw new Error('Failed to get wallet address');
            }
            console.log('Connected with address:', certResponse.annex.signer);
            this.status = {
                isConnected: true,
                address: certResponse.annex.signer,
                network: isMainnet ? 'mainnet' : 'testnet'
            };
            this.notifyListeners();
            await this.updateBalances(); // Auto-update balances on connect
            return this.status;
        }
        catch (error) {
            console.error('Connection error:', error);
            this.status = {
                isConnected: false,
                address: null,
                network: 'testnet'
            };
            throw error;
        }
    }
    async updateBalances() {
        if (!this.status.address)
            return;
        await this.getBalance(this.status.address);
    }
    async getBalance(address) {
        try {
            if (!window.connex?.thor) {
                throw new Error('Not connected to VeChain');
            }
            const account = await window.connex.thor.account(address).get();
            return {
                vet: account.balance || '0',
                vtho: account.energy || '0',
                b3tr: '0' // Will implement later
            };
        }
        catch (error) {
            console.error('Balance check failed:', error);
            return { vet: '0', vtho: '0', b3tr: '0' };
        }
    }
    disconnect() {
        this.status = {
            isConnected: false,
            address: null,
            network: 'testnet'
        };
        this.notifyListeners();
    }
    isConnected() {
        return this.status.isConnected && !!this.status.address && !!window.connex?.thor;
    }
    getAddress() {
        return this.status.address;
    }
    getStatus() {
        return this.status;
    }
    async verifyTestnet() {
        if (!window.connex)
            return false;
        return window.connex.thor.genesis.id === TESTNET_CONFIG.genesis;
    }
}
exports.VeChainConnection = VeChainConnection;
exports.vechain = new VeChainConnection();
