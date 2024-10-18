import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("TokenBridge", (m) => {
  const tokenBridge = m.contract("TokenBridge", []);
  return { tokenBridge };
});