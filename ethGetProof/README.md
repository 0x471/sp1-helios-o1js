# Simple `eth_getProof` Proof of Concept

This project demonstrates the use of the `eth_getProof` functionality, which is not supported on the Hardhat local network. Instead, the Sepolia test network is used as the default network for testing.

https://docs.soliditylang.org/en/latest/internals/layout_in_storage.html

## Overview

- **Default EVM Version**: Paris
- **Deployed Contract Address on Sepolia**: [0x95B3106Ac2D82c003fd876E550571F2d9fE5FF16](https://sepolia.etherscan.io/address/0x95B3106Ac2D82c003fd876E550571F2d9fE5FF16)
  
## Recommended Tool

It is highly recommended to use the following storage slot tool for enhanced functionality:  
[https://storage.herodotus.dev/](https://storage.herodotus.dev/)

## How to Run

1. **Set up your environment variables** with the Sepolia RPC and your private key. (Make sure you have funds on Sepolia.)
   
2. **(Optional)** Deploy your own contract on Sepolia using the following command:
    ```bash
    npx hardhat ignition deploy ./ignition/modules/TokenBridge.ts
    ```
    Alternatively, you can use the contract address provided in the overview section above.

3. **Execute the deposit script** with the address of the contract:
    ```bash
    address=0x95B3106Ac2D82c003fd876E550571F2d9fE5FF16 npx hardhat run scripts/deposit.ts
    ```

4. **Confirm that the retrieved storage slot is correct** using [Herodotus Storage Slot Tool](https://storage.herodotus.dev/).


## Commands
Below are some essential commands you can use to interact with the project:
https://storage.herodotus.dev/

```bash
# Display help for Hardhat commands
npx hardhat help

# Run tests
npx hardhat test

# Run tests and report gas usage
REPORT_GAS=true npx hardhat test

# Start a local Hardhat node
npx hardhat node

# Deploy the TokenBridge module
npx hardhat ignition deploy ./ignition/modules/TokenBridge.ts

# Run the storage layout script
npx hardhat run scripts/viewStorageLayout.ts

# Execute the deposit script with the deployed contract address
address=0x95B3106Ac2D82c003fd876E550571F2d9fE5FF16 npx hardhat run scripts/deposit.ts
```