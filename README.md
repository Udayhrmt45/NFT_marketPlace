# 🖼️ NFT Marketplace – Full Stack Web3 App

A decentralized NFT Marketplace built with **Next.js**, **Solidity**, **Hardhat**, and **Pinata/IPFS**, featuring minting, listing, buying, image watermarking, and full media (image/audio/video) support.

---

## 🧩 Features

- 🔐 Connect wallet via Metamask
- 🖼️ Upload NFTs (Image, Video, Audio)
- 🛡️ Watermark image files before minting
- 🌐 IPFS media & metadata storage using Pinata
- 🛒 Buy & list NFTs on the marketplace
- 👤 View owned and listed NFTs separately
- 🔎 Filter NFTs by media type (image/audio/video)

---

## 📁 Project Structure

nft-marketplace/
├── contract/ # Hardhat smart contract setup
├── frontend/ # Next.js frontend app
└── README.md # Project documentation


---

## 🛠️ Tech Stack

- **Frontend**: Next.js, Tailwind CSS, React
- **Blockchain**: Solidity, Hardhat, ethers.js
- **Storage**: IPFS via Pinata
- **Wallet**: Metamask
- **Deployment**: Vercel (Frontend), Sepolia Testnet (Smart Contract)

---

## ⚙️ Prerequisites

- Node.js v18+
- Git & GitHub
- [MetaMask](https://metamask.io/)
- Pinata account for IPFS
- Vercel account for deployment

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/nft-marketplace.git
cd nft-marketplace


### 2. Setup Smart Contracts (Hardhat)

- Setup Smart Contracts (Hardhat)

```bash
PRIVATE_KEY=your_private_key
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID

- Then:

```bash
npx hardhat compile
npx hardhat run scripts/deploy.js --network sepolia

- Copy the deployed contract address for frontend use.

### 3. Setup Frontend (Next.js)
```bash
cd ../frontend
npm install

- Add .env.local in /frontend:

```bash
NEXT_PUBLIC_CONTRACT_ADDRESS=deployed_contract_address
PINATA_API_KEY=your_pinata_api_key
PINATA_SECRET_KEY=your_pinata_secret_key

4. Start the Local Development Server

```bash
cd frontend
npm run dev

- Visit: http://localhost:3000

### 🌐 Deploying Frontend on Vercel

1. Push your full project to GitHub.
2. Visit https://vercel.com.
3. Import the GitHub repo.
4. Set Root Directory = frontend.
5. Set build command = npm run build and output dir = .next.
6. Add environment variables from .env.local.

Deploy!


