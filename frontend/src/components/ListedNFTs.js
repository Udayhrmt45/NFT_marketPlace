import { useEffect, useState } from "react";
import { useNFT } from "../context/NFTContext.js";
import NFTMedia from "./NFTMedia.js";
import toast from "react-hot-toast";
import axios from "axios";
import { resolveIPFS, getMediaType } from "../utils/ipfs";

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
      setLoading(true);
      try {
        const items = await fetchListedNFTs();
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
              image: fileURL,
              preview: fileURL,
              name: resData.name || "",
              description: resData.description || "",
              type,
            };
          })
        );
        setNfts(metadata);
      } catch (error) {
        toast.error("Failed to load listed NFTs");
      } finally {
        setLoading(false);
      }
    };
    loadNFTs();
  }, [fetchListedNFTs]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0f14] text-gray-400 flex items-center justify-center">
        Loading your listed NFTs...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0f14] text-gray-200">
      <div className="max-w-[1400px] mx-auto px-6 py-10">

        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-semibold text-white mb-1">
            Listed NFTs
          </h2>
          <p className="text-gray-400">
            NFTs currently listed on the marketplace
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

                  <span className="text-sm font-semibold">
                    {nft.price} ETH
                  </span>
                </div>
              </div>
            ))}
        </div>

        {/* Empty State */}
        {nfts.length === 0 && (
          <div className="text-center text-gray-400 mt-20">
            <p className="text-lg">No NFTs listed</p>
            <p className="text-sm">
              List an NFT to see it appear here
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
