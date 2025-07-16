import { createContext, useContext, useEffect, useState } from "react";
import { ethers } from "ethers";
import { MarketAddress, MarketAddressABI } from "../constants.js";
import { toast } from "react-hot-toast";

const NFTContext = createContext();

export const NFTProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState("");

  const getEthereumContract = () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    return new ethers.Contract(MarketAddress, MarketAddressABI, signer);
  };

  const checkWallet = async () => {
    if (!window.ethereum) return toast.error("Install MetaMask");
    const accounts = await window.ethereum.request({ method: "eth_accounts" });
    if (accounts.length) setCurrentAccount(accounts[0]);
  };

  const connectWallet = async () => {
    if (!window.ethereum) return toast.error("Install MetaMask");
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    setCurrentAccount(accounts[0]);
  };

  const disconnectWallet = () => {
    setCurrentAccount("");
    toast("Wallet disconnected");
  };

  const createSale = async (tokenURI, price) => {
    try {
      const contract = getEthereumContract();
      const listingPrice = await contract.getListingPrice();
      const priceInEth = ethers.utils.parseEther(price.toString());
      const tx = await contract.createToken(tokenURI, priceInEth, {
        value: listingPrice.toString(),
      });
      await tx.wait();
    } catch (err) {
      console.error(err);
      throw new Error("Failed to mint or list NFT");
    }
  };

  const fetchMarket = async () => {
    const contract = getEthereumContract();
    const items = await contract.fetchMarketItems();
    return await Promise.all(
      items.map(async (i) => {
        const tokenURI = await contract.tokenURI(i.tokenId);
        return {
          tokenId: i.tokenId.toNumber(),
          price: ethers.utils.formatEther(i.price.toString()),
          seller: i.seller,
          owner: i.owner,
          tokenURI,
        };
      })
    );
  };

  const fetchMyNFTs = async () => {
    const contract = getEthereumContract();
    const items = await contract.fetchMyNFTs();
    return await Promise.all(
      items.map(async (i) => {
        const tokenURI = await contract.tokenURI(i.tokenId);
        return {
          tokenId: i.tokenId.toNumber(),
          price: ethers.utils.formatEther(i.price.toString()),
          seller: i.seller,
          owner: i.owner,
          tokenURI,
        };
      })
    );
  };

  const fetchListedNFTs = async () => {
    const contract = getEthereumContract();
    const items = await contract.fetchItemsListed();
    return await Promise.all(
      items.map(async (i) => {
        const tokenURI = await contract.tokenURI(i.tokenId);
        return {
          tokenId: i.tokenId.toNumber(),
          price: ethers.utils.formatEther(i.price),
          seller: i.seller,
          owner: i.owner,
          tokenURI,
        };
      })
    );
  };

  const resellNFT = async (tokenId, price) => {
    const contract = getEthereumContract();
    const listingPrice = await contract.getListingPrice();
    const priceInEth = ethers.utils.parseEther(price.toString());
    const tx = await contract.resellToken(tokenId, priceInEth, {
      value: listingPrice.toString(),
    });
    await tx.wait();
  };

  const buyNFT = async (nft) => {
    const contract = getEthereumContract();
    const price = ethers.utils.parseEther(nft.price.toString());
    const tx = await contract.createMarketSale(nft.tokenId, { value: price });
    await tx.wait();
  };

  useEffect(() => {
    checkWallet();
  }, []);

  return (
    <NFTContext.Provider
      value={{
        currentAccount,
        connectWallet,
        disconnectWallet,
        createSale,
        fetchMarket,
        fetchMyNFTs,
        fetchListedNFTs,
        resellNFT,
        buyNFT,
      }}
    >
      {children}
    </NFTContext.Provider>
  );
};

export const useNFT = () => useContext(NFTContext);