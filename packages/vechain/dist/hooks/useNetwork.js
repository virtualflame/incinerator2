"use strict";
"use client";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useNetwork = useNetwork;
const react_1 = require("react");
const connection_1 = require("../connection");
function useNetwork() {
    const [isTestnet, setIsTestnet] = (0, react_1.useState)(false);
    const [isLoading, setIsLoading] = (0, react_1.useState)(true);
    (0, react_1.useEffect)(() => {
        const checkNetwork = async () => {
            try {
                const isTestnet = await connection_1.vechain.verifyTestnet();
                setIsTestnet(isTestnet);
            }
            finally {
                setIsLoading(false);
            }
        };
        checkNetwork();
    }, []);
    return { isTestnet, isLoading };
}
