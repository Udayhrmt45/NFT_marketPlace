import formidable from "formidable";
import fs from "fs";
import crypto from "crypto";
import imghash from "imghash";
import path from "path";
import { connectDB, NFT } from "../../lib/db";

export const config = { api: { bodyParser: false } };

const uploadDir = path.join(process.cwd(), "uploads");

function computeSHA256(buffer) {
  return "0x" + crypto.createHash("sha256").update(buffer).digest("hex");
}

async function computePHash(filePath) {
  const hash = await imghash.hash(filePath, 16, "hex");
  return hash;
}

function hammingDistance(h1, h2) {
  let dist = 0;
  for (let i = 0; i < h1.length; i++) {
    if (h1[i] !== h2[i]) dist++;
  }
  return dist;
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  // ✅ Ensure upload dir exists
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const form = formidable({
    multiples: false,
    uploadDir,
    keepExtensions: true,
  });

  form.parse(req, async (err, fields, files) => {
    try {
      if (err) throw err;

      await connectDB();

      // Handle both array/object cases
      const uploadedFile = files.file?.[0] || files.file;
      const filePath = uploadedFile?.filepath;

      if (!filePath || !fs.existsSync(filePath)) {
        console.error("File missing at:", filePath);
        return res.status(500).json({ error: "File not found after upload" });
      }

      const buffer = fs.readFileSync(filePath);
      const sha256 = computeSHA256(buffer);
      const pHash = await computePHash(filePath);

      // Exact duplicate check
      const exact = await NFT.findOne({ sha256 });
      if (exact) {
        fs.unlinkSync(filePath);
        return res.status(400).json({ error: "Exact duplicate detected" });
      }

      // Near-duplicate check
      const allNFTs = await NFT.find({});
      for (const nft of allNFTs) {
        const dist = hammingDistance(pHash, nft.pHash);
        if (dist <= 5) {
          fs.unlinkSync(filePath);
          return res.status(400).json({ error: "Near duplicate detected", similarity: dist });
        }
      }

      // Save new unique NFT hash
      const newNFT = new NFT({ sha256, pHash });
      await newNFT.save();

      fs.unlinkSync(filePath);
      return res.status(200).json({ ok: true, sha256, pHash });
    } catch (e) {
      console.error("Error in duplicate check:", e);
      return res.status(500).json({ error: e.message });
    }
  });
}
