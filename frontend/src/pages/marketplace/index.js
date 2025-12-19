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
    if (!currentAccount) return;

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
    <div className="min-h-screen bg-[#0b0f14] text-gray-200">
      {/* Page Container */}
      <div className="max-w-[1400px] mx-auto px-6 py-10">

        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-semibold text-white mb-1">
            Marketplace
          </h2>
          <p className="text-gray-400">
            Explore digital assets registered on the platform
          </p>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center gap-4 mb-10">
          <span className="text-sm text-gray-400">Filter</span>
          <select
            value={mediaFilter}
            onChange={(e) => setMediaFilter(e.target.value)}
            className="bg-[#151b22] border border-gray-700 text-sm px-4 py-2 rounded-xl outline-none focus:border-blue-500"
          >
            <option value="all">All</option>
            <option value="image">Images</option>
            <option value="audio">Audio</option>
            <option value="video">Video</option>
          </select>
        </div>

        {/* Wallet Not Connected State */}
        {!currentAccount && (
          <div className="border border-gray-800 rounded-2xl p-12 text-center text-gray-400">
            <p className="text-lg mb-2">Wallet not connected</p>
            <p className="text-sm">
              Connect your wallet to browse and purchase NFTs
            </p>
          </div>
        )}

        {/* NFT Grid */}
        {currentAccount && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {nfts
              .filter((nft) => {
                const isOwner =
                  nft.owner?.toLowerCase() === currentAccount;
                return (
                  !isOwner &&
                  (mediaFilter === "all" || nft.type === mediaFilter)
                );
              })
              .map((nft, i) => (
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

                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold">
                        {nft.price} ETH
                      </span>
                      <button
                        onClick={() => handleBuy(nft)}
                        className="px-4 py-2 text-sm rounded-xl bg-blue-600 hover:bg-blue-700 transition"
                      >
                        Buy
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}

        {/* Empty State */}
        {currentAccount && nfts.length === 0 && (
          <div className="text-center text-gray-400 mt-20">
            <p className="text-lg">No NFTs available</p>
            <p className="text-sm">
              Be the first to mint or list an NFT
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
