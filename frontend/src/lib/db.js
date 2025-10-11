import mongoose from "mongoose";

const NFTSchema = new mongoose.Schema({
  sha256: { type: String, unique: true },
  pHash: String,
  tokenId: { type: Number, default: null },
});

export const NFT =
  mongoose.models.NFT || mongoose.model("NFT", NFTSchema);

export async function connectDB() {
  if (mongoose.connection.readyState === 0) {
    try {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log("✅ MongoDB connected");
    } catch (err) {
      console.error("❌ MongoDB connection failed:", err);
    }
  }
}
