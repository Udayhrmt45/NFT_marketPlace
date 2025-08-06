import { useEffect, useState } from "react";
import { useNFT } from "../../context/NFTContext.js";
import NFTMedia from "../../components/NFTMedia.js";
import toast from "react-hot-toast";
import axios from "axios";

export default function MarketplacePage() {
  const { currentAccount, fetchMarket, buyNFT } = useNFT();
  const [nfts, setNfts] = useState([]);
  const [mediaFilter, setMediaFilter] = useState("all");

  useEffect(() => {
    if (!currentAccount) return; // Wait for wallet connection

    const loadNFTs = async () => {
      try {
        const items = await fetchMarket();
        const metadata = await Promise.all(
          items.map(async (item) => {
            const res = await axios.get(item.tokenURI);
            return {
              ...item,
              image: res.data.image,
              name: res.data.name,
              description: res.data.description,
              preview: res.data.preview,
              file: res.data.file,
              type: res.data.type,
            };
          })
        );
        setNfts(metadata);
      } catch (err) {
        console.error("Failed to load NFTs", err);
      }
    };

    loadNFTs();
  }, [currentAccount, fetchMarket]);

  const handleBuy = async (nft) => {
    const loading = toast.loading("Processing purchase...");
    try {
      await buyNFT(nft);
      toast.success("NFT Purchased Successfully!", { id: loading });
    } catch (error) {
      toast.error("Purchase failed.", { id: loading });
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-6">Marketplace</h2>
      {!currentAccount && (
        <p className="text-red-500 mb-4">Connect your wallet to view NFTs</p>
      )}
      <div className="mb-6">
        <label className="mr-2 font-semibold">Filter by media type:</label>
        <select
          className="border rounded px-3 py-1"
          value={mediaFilter}
          onChange={(e) => setMediaFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="image">Images</option>
          <option value="audio">Audio</option>
          <option value="video">Video</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {nfts
          .filter((nft) => {
            const isOwner = nft.owner?.toLowerCase() === currentAccount;
            return !isOwner && (mediaFilter === "all" || nft.type === mediaFilter);
          })
          .map((nft, i) => (
            <div key={i} className="border p-4 rounded-xl shadow-md">
              <NFTMedia src={nft.file} type={nft.type} />
              <h3 className="text-lg font-semibold">{nft.name}</h3>
              <p className="text-sm text-gray-600 mb-2">{nft.description}</p>
              <p className="mb-2 font-bold">Price: {nft.price} ETH</p>
              <button
                onClick={() => handleBuy(nft)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Buy
              </button>
            </div>
          ))}
      </div>
    </div>
  );
}
