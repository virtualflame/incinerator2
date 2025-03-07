"use strict";
"use client";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useBalance = useBalance;
const react_1 = require("react");
const connection_1 = require("../connection");
function useBalance() {
    const [balances, setBalances] = (0, react_1.useState)({ vet: '0', vtho: '0', b3tr: '0' });
    const [isLoading, setIsLoading] = (0, react_1.useState)(false);
    const [error, setError] = (0, react_1.useState)(null);
    (0, react_1.useEffect)(() => {
        const updateBalance = async () => {
            const address = connection_1.vechain.getAddress();
            if (!address)
                return;
            try {
                setIsLoading(true);
                const balance = await connection_1.vechain.getBalance(address);
                setBalances(balance);
            }
            catch (err) {
                setError(err);
            }
            finally {
                setIsLoading(false);
            }
        };
        const handleStatusChange = () => {
            updateBalance();
        };
        connection_1.vechain.onConnect(handleStatusChange);
        updateBalance();
        return () => {
            // Cleanup if needed
        };
    }, []);
    return { balances, isLoading, error };
}
