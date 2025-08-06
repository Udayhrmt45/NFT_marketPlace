import { useEffect, useState } from "react";
import { useNFT } from "../context/NFTContext.js";
import NFTMedia from "./NFTMedia.js";
import toast from "react-hot-toast";
import axios from "axios";

export default function MyNFTsPage() {
  const { currentAccount, fetchMyNFTs, resellNFT } = useNFT();
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [price, setPrice] = useState({});
  const [mediaFilter, setMediaFilter] = useState("all");

  useEffect(() => {
    if (!currentAccount) {
      setNfts([]);
      setLoading(false);
      return;
    }

    const loadNFTs = async () => {
      setLoading(true);
      try {
        const items = await fetchMyNFTs();

        const metadata = await Promise.all(
          items.map(async (item) => {
            let tokenURI = item.tokenURI;
            let resData = {};

            try {
              const res = await axios.get(tokenURI);
              resData = res.data || {};
            } catch (err) {
              console.warn("Failed to fetch metadata for tokenURI:", tokenURI, err?.message || err);
            }

            return {
              tokenId: item.tokenId,
              price: item.price,
              seller: item.seller,
              owner: item.owner,
              tokenURI,
              name: resData.name || "",
              description: resData.description || "",
              file: resData.file || resData.image || "",
              preview: resData.preview || resData.image || "",
              type: resData.type || (resData.image ? "image" : ""),
            };
          })
        );

        setNfts(metadata);
      } catch (error) {
        console.error("Error loading my NFTs:", error);
        toast.error("Failed to load your NFTs");
      } finally {
        setLoading(false);
      }
    };

    loadNFTs();
  }, [currentAccount, fetchMyNFTs]);

  const handleResell = async (tokenId) => {
    const newPrice = price[tokenId];
    if (!newPrice) return toast.error("Enter a valid price");
    const loadingToast = toast.loading("Listing NFT for resale...");
    try {
      await resellNFT(tokenId, newPrice);
      toast.success("NFT listed for resale", { id: loadingToast });
    } catch (error) {
      console.error("Resell failed:", error);
      toast.error("Resale failed", { id: loadingToast });
    }
  };

  if (loading) return <p className="p-8">Loading your NFTs...</p>;

  // By design fetchMyNFTs returns only NFTs owned by currentAccount,
  // so we don't need to filter out owners. We do provide media type filter.
  const visibleNfts = nfts.filter((nft) => mediaFilter === "all" || nft.type === mediaFilter);

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

      {visibleNfts.length === 0 ? (
        <p className="text-gray-600">You don't own any NFTs (or none match the selected filter).</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {visibleNfts.map((nft, i) => (
            <div key={i} className="border p-4 rounded-xl shadow-md">
              <NFTMedia src={nft.file} type={nft.type} />
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
      )}
    </div>
  );
}

