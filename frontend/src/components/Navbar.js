import { useNFT } from "../context/NFTContext";
import Link from "next/link";

export default function Navbar() {
  const { currentAccount, connectWallet, disconnectWallet } = useNFT();

  return (
    <nav className="sticky top-0 z-50 bg-[#0b0f14] border-b border-gray-800">
      <div className="max-w-[1400px] mx-auto px-6 py-3 flex items-center gap-6">

        {/* Brand */}
        <h1 className="text-lg font-semibold text-white tracking-wide whitespace-nowrap">
          NFT Marketplace
        </h1>

        {/* Search Bar */}
        <div className="flex-1">
          <div className="relative max-w-xl">
            <input
              type="text"
              placeholder="Search items, collections, and accounts"
              className="w-full bg-[#151b22] text-sm text-gray-200 placeholder-gray-400 px-4 py-2 rounded-xl outline-none border border-gray-700 focus:border-blue-500"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500">
              /
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex items-center gap-6 text-sm text-gray-300">
          <Link href="/" className="hover:text-white transition">
            Marketplace
          </Link>
          <Link href="/create-nft" className="hover:text-white transition">
            Create
          </Link>
          <Link href="/my-nfts" className="hover:text-white transition">
            My NFTs
          </Link>
          <Link href="/listed-nfts" className="hover:text-white transition">
            Listed
          </Link>
          <Link href="/profile" className="hover:text-white transition">
            Profile
          </Link>

          {/* Wallet Section */}
          {currentAccount ? (
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-[#151b22] rounded-full text-xs font-mono text-gray-200 border border-gray-700">
                {currentAccount.slice(0, 6)}...{currentAccount.slice(-4)}
              </span>
              <button
                onClick={disconnectWallet}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={connectWallet}
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm transition"
            >
              Connect Wallet
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
