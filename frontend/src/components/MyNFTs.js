import { useEffect, useState } from "react";
import { useNFT } from "../context/NFTContext.js";
import NFTMedia from "../components/NFTMedia";
import toast from "react-hot-toast";
import axios from "axios";

export default function MyNFTsPage() {
  const { fetchMyNFTs, resellNFT } = useNFT();
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [price, setPrice] = useState({});
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
        const items = await fetchMyNFTs();
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
      <div className="mb-6">
        <label className="mr-2">Filter by Media Type:</label>
        <select
          value={mediaFilter}
          onChange={(e) => setMediaFilter(e.target.value)}
          className="p-2 border rounded"
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
                <input
                  placeholder="Resale Price in ETH"
                  type="number"
                  className="block w-full mb-2 p-2 border rounded"
                  onChange={(e) =>
                    setPrice({ ...price, [nft.tokenId]: e.target.value })
                  }
                />
                <button
                  onClick={() => handleResell(nft.tokenId)}
                  className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
                >
                  Resell
                </button>
              </div>
            );
          })}
      </div>
    </div>
  );
}
