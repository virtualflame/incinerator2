"use strict";
"use client";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useWallet = useWallet;
const react_1 = require("react");
const connection_1 = require("../connection");
function useWallet() {
    const [status, setStatus] = (0, react_1.useState)({
        isConnected: false,
        address: null,
        network: 'testnet'
    });
    const [isLoading, setIsLoading] = (0, react_1.useState)(false);
    const [error, setError] = (0, react_1.useState)(null);
    (0, react_1.useEffect)(() => {
        const handleUpdate = (newStatus) => {
            setStatus(newStatus);
        };
        connection_1.vechain.onConnect(handleUpdate);
        return () => {
            // Cleanup if needed
        };
    }, []);
    const connect = (0, react_1.useCallback)(async () => {
        try {
            setIsLoading(true);
            setError(null);
            const status = await connection_1.vechain.connect();
            return status;
        }
        catch (err) {
            const error = err;
            setError(error);
            throw error;
        }
        finally {
            setIsLoading(false);
        }
    }, []);
    return {
        connect,
        disconnect: connection_1.vechain.disconnect.bind(connection_1.vechain),
        isConnected: status.isConnected,
        address: status.address,
        isLoading,
        error
    };
}
