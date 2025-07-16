import { useNFT } from "../context/NFTContext";
import Link from "next/link";

export default function Navbar() {
  const { currentAccount, connectWallet } = useNFT();

  return (
    <nav className="flex justify-between items-center p-4 bg-gray-800 text-white">
      <h1 className="text-xl font-bold">NFT Marketplace</h1>
      <div className="flex items-center gap-4">
        <Link href="/">Marketplace</Link>
        <Link href="/create-nft">Create</Link>
        <Link href="/my-nfts">My NFTs</Link>
        <Link href="/listed-nfts">Listed</Link>
        <Link href="/profile">Profile</Link>
        <button
          onClick={connectWallet}
          className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
        >
          {currentAccount
            ? `${currentAccount.slice(0, 6)}...${currentAccount.slice(-4)}`
            : "Connect Wallet"}
        </button>
      </div>
    </nav>
  );
}