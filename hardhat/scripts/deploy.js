// Import necessary modules
const { ethers } = require("hardhat");
require("dotenv").config(); // For loading environment variables (e.g., private key)

// This script will deploy your NFTMarketplace contract
async function main() {
  // Ensure that the contract owner address is set from the environment
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Get the contract factory for NFTMarketplace
  const NFTMarketplace = await ethers.getContractFactory("NFTMarketplace");

  // Deploy the contract (this will deploy it to the network you have set in `hardhat.config.js`)
  const nftMarketplace = await NFTMarketplace.deploy();
  console.log("NFTMarketplace contract deployed to:", nftMarketplace.address);

  // Optionally: Save the contract address to a file for later use
  const fs = require("fs");
  const data = JSON.stringify(
    { contractAddress: nftMarketplace.address },
    null,
    2
  );
  fs.writeFileSync("deployedAddress.json", data);

  // Return contract address for future use
  return nftMarketplace.address;
}

// Execute the deploy script
main()
  .then(() => process.exit(0)) // Exit after successful deployment
  .catch((error) => {
    console.error(error);
    process.exit(1); // Exit with failure
  });
