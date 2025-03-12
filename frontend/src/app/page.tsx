"use client";
import { useState } from "react";
import { createNFT } from "../utils/marketplace";
import { parseEther } from "ethers";

export default function Home() {
  const [tokenURI, setTokenURI] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState(null);

  const handleMintNFT = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const tx = await createNFT(tokenURI, parseEther(price));
      setTxHash(tx.hash); // Store the transaction hash for reference
    } catch (error) {
      console.error("Error minting NFT:", error);
    }
    setLoading(false);
  };

  return (
    <div className="bg-cyan-700 text-black w-full h-full">
      <h1>Mint NFT</h1>
      <form onSubmit={handleMintNFT}>
        <div>
          <label htmlFor="tokenURI">Token URI (IPFS):</label>
          <input
            id="tokenURI"
            type="text"
            value={tokenURI}
            onChange={(e) => setTokenURI(e.target.value)}
            className="bg-white"
            required
          />
        </div>
        <div>
          <label htmlFor="price">Price (ETH):</label>
          <input
            id="price"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="bg-white"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-green-800 hover:cursor-pointer"
        >
          {loading ? "Minting..." : "Mint NFT"}
        </button>
      </form>

      {txHash && (
        <div>
          <h2>Transaction Sent!</h2>
          <p>
            View your transaction on Etherscan:{" "}
            <a
              href={`https://rinkeby.etherscan.io/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              View Transaction
            </a>
          </p>
        </div>
      )}
    </div>
  );
}
