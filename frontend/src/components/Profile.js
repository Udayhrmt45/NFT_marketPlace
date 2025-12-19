import { useNFT } from "../context/NFTContext.js";

export default function Profile() {
  const { currentAccount, connectWallet, disconnectWallet } = useNFT();

  return (
    <div className="min-h-screen bg-[#0b0f14] text-gray-200 flex items-center justify-center">
      {/* Card */}
      <div className="w-full max-w-lg bg-[#111827] border border-gray-800 rounded-2xl p-8 text-center shadow-lg">
        
        {/* Title */}
        <h2 className="text-3xl font-semibold text-white mb-2">
          My Profile
        </h2>
        <p className="text-gray-400 mb-8">
          Manage your wallet connection
        </p>

        {currentAccount ? (
          <>
            {/* Wallet Info */}
            <div className="mb-6">
              <p className="text-sm text-gray-400 mb-2">
                Connected Wallet
              </p>
              <div className="bg-[#0b0f14] border border-gray-700 rounded-xl px-4 py-3 font-mono text-sm text-blue-400 break-all">
                {currentAccount}
              </div>
            </div>

            {/* Disconnect Button */}
            <button
              onClick={disconnectWallet}
              className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 transition font-medium"
            >
              Disconnect Wallet
            </button>
          </>
        ) : (
          <>
            {/* Not Connected State */}
            <p className="text-gray-400 mb-6">
              You are not connected to a wallet
            </p>

            <button
              onClick={connectWallet}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 transition font-medium"
            >
              Connect Wallet
            </button>
          </>
        )}
      </div>
    </div>
  );
}
