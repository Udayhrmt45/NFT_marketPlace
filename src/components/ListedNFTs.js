import { useEffect, useState } from "react";
import { useNFT } from "../context/NFTContext.js";
import toast from "react-hot-toast";
import axios from "axios";

export default function ListedNFTs() {
  const { fetchListedNFTs } = useNFT();
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNFTs = async () => {
      try {
        const items = await fetchListedNFTs();
        console.log("Fetched listed NFTs:", items);
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
        toast.error("Failed to load your listed NFTs");
      } finally {
        setLoading(false);
      }
    };
    loadNFTs();
  }, []);
  

  if (loading) return <p className="p-8">Loading your listed NFTs...</p>;

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-6">Listed NFTs</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {nfts.map((nft, i) => (
          <div key={i} className="border p-4 rounded-xl shadow-md">
            <img src={nft.image} alt={nft.name} className="rounded w-full h-64 object-cover mb-2" />
            <h3 className="text-lg font-semibold">{nft.name}</h3>
            <p className="text-sm text-gray-600 mb-2">{nft.description}</p>
            <p className="mb-2 font-bold">Price: {nft.price} ETH</p>
          </div>
        ))}
      </div>
    </div>
  );
}
