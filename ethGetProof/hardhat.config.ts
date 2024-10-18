require('dotenv').config();
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-storage-layout";

if (!process.env.SEPOLIA_RPC || !process.env.PRIVATE_KEY) {
  throw new Error("Missing environment variables. Ensure SEPOLIA_RPC and PRIVATE_KEY are set.");
}

module.exports = {
  defaultNetwork: "sepolia",
  networks: {
    hardhat: {},
    sepolia: {
      url: process.env.SEPOLIA_RPC,
      accounts: [`0x${process.env.PRIVATE_KEY}`]
    }
  },
  solidity: {
    version: "0.8.27",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  }
};
