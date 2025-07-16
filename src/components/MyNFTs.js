import { useEffect, useState } from "react";
import { useNFT } from "../context/NFTContext.js";
import toast from "react-hot-toast";
import axios from "axios";

export default function MyNFTsPage() {
  const { fetchMyNFTs, resellNFT } = useNFT();
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [price, setPrice] = useState({});

  useEffect(() => {
    const loadNFTs = async () => {
      try {
        const items = await fetchMyNFTs();
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
      } catch (error) {
        toast.error("Failed to load your NFTs");
      } finally {
        setLoading(false);
      }
    };
    loadNFTs();
  }, []);

  const handleResell = async (tokenId) => {
    const newPrice = price[tokenId];
    if (!newPrice) return toast.error("Enter a valid price");
    const loading = toast.loading("Listing NFT for resale...");
    try {
      await resellNFT(tokenId, newPrice);
      toast.success("NFT listed for resale", { id: loading });
    } catch (error) {
      toast.error("Resale failed", { id: loading });
    }
  };

  if (loading) return <p className="p-8">Loading your NFTs...</p>;

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-6">My NFTs</h2>
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
            <input
              placeholder="Resale Price in ETH"
              type="number"
              className="block w-full mb-2 p-2 border rounded"
              onChange={(e) => setPrice({ ...price, [nft.tokenId]: e.target.value })}
            />
            <button
              onClick={() => handleResell(nft.tokenId)}
              className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
            >
              Resell
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}