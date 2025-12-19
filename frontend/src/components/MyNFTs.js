import { useEffect, useState } from "react";
import { useNFT } from "../context/NFTContext.js";
import NFTMedia from "./NFTMedia.js";
import toast from "react-hot-toast";
import axios from "axios";
import { resolveIPFS, getMediaType } from "../utils/ipfs";

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
            const tokenURI = resolveIPFS(item.tokenURI);
            let resData = {};
            try {
              const res = await axios.get(tokenURI);
              resData = res.data;
            } catch (err) {
              console.warn("Failed to fetch metadata:", tokenURI);
            }

            const fileURL = resolveIPFS(resData.file || resData.image);
            const type = getMediaType(resData.properties?.contentType);

            return {
              ...item,
              file: fileURL,
              preview: fileURL,
              name: resData.name || "",
              description: resData.description || "",
              type,
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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0f14] text-gray-400 flex items-center justify-center">
        Loading your NFTs...
      </div>
    );
  }

  const visibleNfts = nfts.filter(
    (nft) => mediaFilter === "all" || nft.type === mediaFilter
  );

  return (
    <div className="min-h-screen bg-[#0b0f14] text-gray-200">
      <div className="max-w-[1400px] mx-auto px-6 py-10">

        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-semibold text-white mb-1">
            My NFTs
          </h2>
          <p className="text-gray-400">
            NFTs owned by your wallet
          </p>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-4 mb-10">
          <span className="text-sm text-gray-400">Filter</span>
          <select
            value={mediaFilter}
            onChange={(e) => setMediaFilter(e.target.value)}
            className="bg-[#151b22] border border-gray-700 text-sm px-4 py-2 rounded-xl outline-none focus:border-blue-500"
          >
            <option value="all">All</option>
            <option value="image">Images</option>
            <option value="video">Videos</option>
            <option value="audio">Audio</option>
          </select>
        </div>

        {/* NFT Grid */}
        {visibleNfts.length === 0 ? (
          <div className="text-center text-gray-400 mt-20">
            <p className="text-lg">No NFTs found</p>
            <p className="text-sm">
              Mint or purchase NFTs to see them here
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {visibleNfts.map((nft, i) => (
              <div
                key={i}
                className="bg-[#111827] border border-gray-800 rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition"
              >
                {/* Media */}
                <div className="bg-black">
                  <NFTMedia src={nft.file} type={nft.type} />
                </div>

                {/* Card Content */}
                <div className="p-4">
                  <h3 className="text-white font-semibold truncate">
                    {nft.name}
                  </h3>
                  <p className="text-gray-400 text-sm line-clamp-2 mb-3">
                    {nft.description}
                  </p>

                  <p className="text-sm font-semibold mb-3">
                    {nft.price} ETH
                  </p>

                  <input
                    placeholder="Resale price (ETH)"
                    type="number"
                    className="w-full mb-3 px-3 py-2 text-sm bg-[#0b0f14] border border-gray-700 rounded-xl outline-none focus:border-blue-500"
                    onChange={(e) =>
                      setPrice({ ...price, [nft.tokenId]: e.target.value })
                    }
                  />

                  <button
                    onClick={() => handleResell(nft.tokenId)}
                    className="w-full px-4 py-2 text-sm rounded-xl bg-purple-600 hover:bg-purple-700 transition"
                  >
                    Resell NFT
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
