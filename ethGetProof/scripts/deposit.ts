import { ethers } from "hardhat";
import { abi } from "../artifacts/contracts/TokenBridge.sol/TokenBridge.json";

async function main() {
  const contractAddress = process.env.address;
  console.log("TokenBridge contract address", contractAddress);

  if (contractAddress && ethers.isAddress(contractAddress)) {
    const [signer] = await ethers.getSigners();
    const contract = new ethers.Contract(contractAddress, abi, signer);

    const amountToLock = ethers.parseEther("0.0001");
    console.log(`Calling lockTokens function with amount: ${amountToLock.toString()}...`);
    const tx = await contract.lockTokens({ value: amountToLock });
    await tx.wait();
    console.log(`Amount locked: ${amountToLock.toString()}`);


    const abiCoder = ethers.AbiCoder.defaultAbiCoder()
    // https://storage.herodotus.dev/
    const storageKey = ethers.keccak256(abiCoder.encode(["address", "uint256"], [signer.address, 1]));
    console.log(`Computed storage key: ${storageKey}`);
    try {
      console.log(`Requesting proof for storage key from contract at address: ${contractAddress}...`);
      const proof = await ethers.provider.send("eth_getProof", [contractAddress, [storageKey], "latest"]);
      console.log(`Proof retrieved successfully. Storage Proof: ${JSON.stringify(proof.storageProof, null, 2)}`);
    } catch (error) {
      console.error("Error retrieving proof:", error);
    }
  } else {
    throw new Error("Invalid contract address parameter");
  }
}

main().catch((error) => {
  console.error("Error in script:", error);
  process.exit(1);
});
