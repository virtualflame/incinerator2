"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.vechain = exports.VeChainConnection = void 0;
// Add testnet configuration
const TESTNET_CONFIG = {
    node: 'https://testnet.veblocks.net',
    network: 'test',
    genesis: '0x000000000b2bce3c70bc649a02749e8687721b09ed2e15997f466536b20bb127'
};
// Update constants for better timing
const VEWORLD_CHECK_ATTEMPTS = 50;
const VEWORLD_CHECK_INTERVAL = 200; // Increased interval
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
        var _a;
        return typeof window !== 'undefined' && !!((_a = window.connex) === null || _a === void 0 ? void 0 : _a.thor);
    }
    async waitForVeWorld() {
        var _a, _b;
        // First check if we're in a browser
        if (typeof window === 'undefined') {
            throw new Error('Cannot connect to VeWorld in a non-browser environment');
        }
        // Check for wallet extension
        if (!window.vechain) {
            console.log('VeWorld extension not found');
            throw new Error('Please install VeWorld wallet extension: https://vechain.github.io/veworld/');
        }
        console.log('VeWorld extension found, attempting to connect...');
        // Try to trigger the wallet popup
        try {
            // This should trigger the VeWorld popup
            await ((_a = window.vechain.thor) === null || _a === void 0 ? void 0 : _a.enable());
            console.log('Wallet popup triggered');
        }
        catch (e) {
            console.log('Failed to trigger wallet popup:', e);
            throw new Error('Please unlock your VeWorld wallet to continue');
        }
        // Then wait for initialization
        for (let i = 1; i <= VEWORLD_CHECK_ATTEMPTS; i++) {
            if ((_b = window.connex) === null || _b === void 0 ? void 0 : _b.thor) {
                try {
                    const chainTag = await window.connex.thor.genesis.id;
                    console.log('Connected to chain:', chainTag);
                    return;
                }
                catch (e) {
                    console.log('Waiting for full initialization...', e);
                }
            }
            console.log(`Waiting for VeWorld to initialize... (${i}/${VEWORLD_CHECK_ATTEMPTS})`);
            await new Promise(resolve => setTimeout(resolve, VEWORLD_CHECK_INTERVAL));
        }
        throw new Error('VeWorld initialization timed out. Please try again.');
    }
    async connect() {
        var _a, _b;
        try {
            console.log('Starting wallet connection...');
            // Clear any existing state
            this.disconnect();
            await this.waitForVeWorld();
            console.log('VeWorld initialized');
            // Verify connection is ready
            if (!((_a = window.connex) === null || _a === void 0 ? void 0 : _a.thor)) {
                throw new Error('VeWorld not properly initialized. Please unlock your wallet.');
            }
            // Get user's address with better error handling
            try {
                console.log('Requesting wallet connection...');
                const certResponse = await window.connex.vendor
                    .sign('cert', {
                    purpose: 'identification',
                    payload: {
                        type: 'text',
                        content: 'Connect to VFS Incinerator'
                    }
                })
                    .request();
                if (!((_b = certResponse === null || certResponse === void 0 ? void 0 : certResponse.annex) === null || _b === void 0 ? void 0 : _b.signer)) {
                    throw new Error('Failed to get wallet address');
                }
                console.log('Connected with address:', certResponse.annex.signer);
                this.status = {
                    isConnected: true,
                    address: certResponse.annex.signer,
                    network: 'testnet'
                };
                this.notifyListeners();
                await this.updateBalances();
                return this.status;
            }
            catch (err) {
                console.error('Connection request failed:', err);
                throw new Error('Connection request was rejected. Please try again.');
            }
        }
        catch (error) {
            console.error('Connection error:', error);
            this.disconnect();
            throw error;
        }
    }
    async updateBalances() {
        if (!this.status.address)
            return;
        await this.getBalance(this.status.address);
    }
    async getBalance(address) {
        var _a;
        try {
            if (!((_a = window.connex) === null || _a === void 0 ? void 0 : _a.thor)) {
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
        var _a;
        return this.status.isConnected && !!this.status.address && !!((_a = window.connex) === null || _a === void 0 ? void 0 : _a.thor);
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
