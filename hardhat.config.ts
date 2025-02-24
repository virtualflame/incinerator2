import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "dotenv/config";

// Load environment variables
const PRIVATE_KEY = process.env.PRIVATE_KEY || "";
const VECHAIN_NODE = process.env.NEXT_PUBLIC_VECHAIN_NODE || "https://testnet.veblocks.net";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    vechain_testnet: {
      url: VECHAIN_NODE,
      accounts: [PRIVATE_KEY],
      chainId: 39 // VeChain testnet chainId
    }
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  }
};

export default config; 