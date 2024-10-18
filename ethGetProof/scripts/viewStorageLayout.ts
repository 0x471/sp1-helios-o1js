import hre from "hardhat";

async function main() {
  try {
    await hre.storageLayout.export();
  } catch (error) {
    console.error("Error exporting storage layout:", error);
    process.exit(1);
  }
}

main().then(() => {
  console.log("Storage layout exported successfully.");
}).catch((error) => {
  console.error("An error occurred during the process:", error);
});
