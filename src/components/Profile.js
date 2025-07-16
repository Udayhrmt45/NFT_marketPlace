import { useNFT } from "../context/NFTContext.js";

export default function Profile() {
  const { currentAccount, connectWallet, disconnectWallet } = useNFT();

  return (
    <div className="max-w-xl mx-auto p-8 text-center">
      <h2 className="text-3xl font-bold mb-6">My Profile</h2>
      {currentAccount ? (
        <>
          <p className="mb-4 text-gray-700 break-all">Connected Wallet:</p>
          <p className="font-mono text-blue-600 mb-6">{currentAccount}</p>
          <button
            onClick={disconnectWallet}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Disconnect Wallet
          </button>
        </>
      ) : (
        <button
          onClick={connectWallet}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Connect Wallet
        </button>
      )}
    </div>
  );
}
