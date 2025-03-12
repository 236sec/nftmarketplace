require("dotenv").config(); // To load .env file for private key
const { ethers, parseEther, formatEther } = require("ethers");
const readline = require("readline"); // Import readline for terminal input

// Set up the provider to interact with your Hardhat local network
const provider = new ethers.JsonRpcProvider("http://localhost:8545"); // Change if needed

// Load the private key from environment variables (store this in a .env file)
const privateKey = process.env.PRIVATE_KEY; // Ensure your private key is in a .env file
const wallet = new ethers.Wallet(privateKey, provider);

// Contract ABI (simplified for interaction)
const contractABI = [
  "function createToken(string memory tokenURI, uint256 price) public payable returns (uint)",
  "function getListPrice() public view returns (uint256)",
  "function getAllNFTs() public view returns (tuple(uint256, address, address, uint256, bool)[])",
  "function executeSale(uint256 tokenId) public payable",
];

// Contract address (replace with your deployed contract address)
const contractAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3";

// Connect to the contract
const contract = new ethers.Contract(contractAddress, contractABI, wallet);

// Create a readline interface to handle user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Function to create NFT
async function createNFT() {
  const tokenURI = process.env.TOKEN_URI;
  const price = parseEther("0.1"); // Example price in ETH

  console.log(
    `Creating NFT with URI: ${tokenURI} and price: ${price.toString()}...`
  );
  const tx = await contract.createToken(tokenURI, price, {
    value: parseEther("0.01"),
  }); // Sending list price with transaction
  const receipt = await tx.wait(); // Wait for the transaction to be mined

  console.log(`NFT Created! Transaction Hash: ${receipt.transactionHash}`);
}

// Function to list all NFTs
async function listNFTs() {
  const nfts = await contract.getAllNFTs();
  console.log("All NFTs listed for sale:");
  nfts.forEach((nft) => {
    console.log(
      `Token ID: ${nft[0]}, Owner: ${nft[1]}, Seller: ${
        nft[2]
      }, Price: ${formatEther(nft[3])} ETH, Listed: ${nft[4]}`
    );
  });
}

// Function to buy NFT
async function buyNFT(tokenId) {
  const price = await contract.getListedTokenForId(tokenId);
  const tokenPrice = price.price;

  console.log(
    `Buying NFT with tokenId: ${tokenId} for ${formatEther(tokenPrice)} ETH...`
  );

  const tx = await contract.executeSale(tokenId, { value: tokenPrice });
  const receipt = await tx.wait();

  console.log(`NFT Purchased! Transaction Hash: ${receipt.transactionHash}`);
}

// Function to prompt the user for an option and call the respective function
function promptUser() {
  rl.question(
    "Select an option:\n1. Create NFT\n2. List NFTs\n3. Buy NFT\nEnter 1, 2, or 3: ",
    async (answer) => {
      if (answer === "1") {
        await createNFT();
      } else if (answer === "2") {
        await listNFTs();
      } else if (answer === "3") {
        rl.question("Enter the token ID to buy: ", async (tokenId) => {
          await buyNFT(parseInt(tokenId));
        });
      } else {
        console.log("Invalid option. Please enter 1, 2, or 3.");
      }
      rl.close(); // Close the readline interface after the operation
    }
  );
}

// Call the promptUser function to start the interaction
promptUser();
