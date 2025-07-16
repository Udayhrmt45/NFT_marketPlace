import { useEffect, useState } from "react";
import { useNFT } from "../../context/NFTContext.js";
import toast from "react-hot-toast";
import axios from "axios";

export default function MarketplacePage() {
  const { fetchMarket, buyNFT } = useNFT();
  const [nfts, setNfts] = useState([]);

  useEffect(() => {
    const loadNFTs = async () => {
      const items = await fetchMarket();
      const metadata = await Promise.all(items.map(async (item) => {
        const res = await axios.get(item.tokenURI);
        return {
          ...item,
          image: res.data.image,
          name: res.data.name,
          description: res.data.description,
        };
      }));
      setNfts(metadata);
    };
    loadNFTs();
  }, []);

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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {nfts.map((nft, i) => (
          <div key={i} className="border p-4 rounded-xl shadow-md">
            <img
              src={nft.image}
              alt={nft.name}
              className="rounded w-full h-64 object-cover mb-2"
            />
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