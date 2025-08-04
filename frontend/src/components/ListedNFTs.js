import { useEffect, useState } from "react";
import { useNFT } from "../context/NFTContext.js";
import NFTMedia from "./NFTMedia.js";
import toast from "react-hot-toast";
import axios from "axios";

export default function ListedNFTs() {
  const { fetchListedNFTs } = useNFT();
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentAccount, setCurrentAccount] = useState("");
  const [mediaFilter, setMediaFilter] = useState("all");

  useEffect(() => {
    async function getAccount() {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });
        setCurrentAccount(accounts[0]?.toLowerCase());
      }
    }
    getAccount();
  }, []);

  useEffect(() => {
    const loadNFTs = async () => {
      try {
        const items = await fetchListedNFTs();
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
      <div className="mb-6">
        <label className="block mb-2 font-medium">Filter by Media Type:</label>
        <select
          value={mediaFilter}
          onChange={(e) => setMediaFilter(e.target.value)}
          className="border rounded p-2"
        >
          <option value="all">All</option>
          <option value="image">Images</option>
          <option value="video">Videos</option>
          <option value="audio">Audio</option>
        </select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {nfts
          .filter((nft) => {
            const isOwner = nft.owner?.toLowerCase() === currentAccount;
            return !isOwner && (mediaFilter === "all" || nft.type === mediaFilter);
          })
          .map((nft, i) => {
            return (
              <div key={i} className="border p-4 rounded-xl shadow-md">
                <NFTMedia src={nft.file} type={nft.type} />
                <h3 className="text-lg font-semibold">{nft.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{nft.description}</p>
                <p className="mb-2 font-bold">Price: {nft.price} ETH</p>
              </div>
            );
          })}
      </div>
    </div>
  );
}
