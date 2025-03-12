// utils/marketplace.js
import { parseEther } from "ethers";
import { ethers } from "ethers";

const marketplaceAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3"; // Replace with your deployed contract address
const marketplaceABI = [
  "function createToken(string memory tokenURI, uint256 price) public payable returns (uint)",
];

let provider;
let signer;
let marketplace;

// Initialize Ethers.js provider and contract instance
const initializeContract = async () => {
  if (typeof window.ethereum !== "undefined") {
    provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []); // Request accounts from MetaMask
    signer = provider.getSigner();
    marketplace = new ethers.Contract(
      marketplaceAddress,
      marketplaceABI,
      signer
    );
  } else {
    console.error("MetaMask is not installed!");
  }
};

// Create an NFT using the contract's createToken function
const createNFT = async (tokenURI, price) => {
  await initializeContract();

  const tx = await marketplace.createToken(tokenURI, price, {
    value: parseEther("0.01"), // Listing fee, adjust as needed
  });
  console.log("Token minted:", tx);
  return tx;
};

export { createNFT };
