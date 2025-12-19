import { useState } from "react";
import { useNFT } from "../context/NFTContext";
import { uploadToIPFS, uploadMetadataToIPFS } from "../utils/pinata.js";
import { addWatermark } from "../utils/watermark.js";
import toast from "react-hot-toast";

export default function CreateNFTForm() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", price: "" });
  const [isUploading, setIsUploading] = useState(false);
  const { createSale } = useNFT();

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (newFile) => {
    if (!newFile) return;

    if (newFile.size > 30 * 1024 * 1024) {
      toast.error("File size must be less than 30MB");
      return;
    }

    const validTypes = [
      "image/jpeg", "image/png", "image/gif", "image/webp",
      "video/mp4", "video/webm",
      "audio/mpeg", "audio/wav"
    ];
    if (!validTypes.includes(newFile.type)) {
      toast.error("Invalid file type");
      return;
    }

    setFile(newFile);
    setPreviewUrl(URL.createObjectURL(newFile));
  };

  const handleSubmit = async () => {
    if (isUploading) return;
    if (!file || !form.name || !form.description || !form.price) {
      toast.error("All fields are required");
      return;
    }

    setIsUploading(true);
    const loading = toast.loading("Minting NFT...");

    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      const watermarkText = `© ${accounts[0].slice(0, 6)}...`;
      const watermarkedFile = await addWatermark(file, watermarkText);
      const fileURL = await uploadToIPFS(watermarkedFile);

      const metadataURL = await uploadMetadataToIPFS({
        name: form.name,
        description: form.description,
        file: fileURL,
        type: file.type.startsWith("video")
          ? "video"
          : file.type.startsWith("audio")
          ? "audio"
          : "image",
      });

      await createSale(metadataURL, form.price);
      toast.success("NFT Minted Successfully!", { id: loading });

      setFile(null);
      setPreviewUrl("");
      setForm({ name: "", description: "", price: "" });
    } catch {
      toast.error("Minting failed", { id: loading });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f14] flex items-center justify-center px-4">
      <div className="w-full max-w-xl bg-[#111827] border border-gray-800 rounded-2xl p-8">

        <h2 className="text-2xl font-semibold text-white mb-1">
          Create New NFT
        </h2>
        <p className="text-gray-400 mb-6">
          Upload your file and mint it on the blockchain
        </p>

        {/* Upload Box */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={() => setDragActive(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragActive(false);
            handleFileChange(e.dataTransfer.files[0]);
          }}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition
            ${dragActive ? "border-blue-500 bg-blue-500/10" : "border-gray-700 hover:border-gray-500"}
          `}
        >
          <p className="text-gray-300">
            {file ? file.name : "Drag & drop your file here"}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Images, video, audio (max 30MB)
          </p>
          <input
            type="file"
            accept="image/*,audio/*,video/*"
            onChange={(e) => handleFileChange(e.target.files[0])}
            className="hidden"
            id="fileInput"
          />
        </div>

        <button
          onClick={() => document.getElementById("fileInput").click()}
          className="w-full mt-3 py-2 rounded-xl bg-[#151b22] text-gray-300 hover:bg-[#1f2937]"
        >
          Browse Files
        </button>

        {/* Preview */}
        {previewUrl && (
          <img
            src={previewUrl}
            alt="Preview"
            className="w-full aspect-square object-cover rounded-xl mt-6"
          />
        )}

        {/* Form */}
        <div className="space-y-4 mt-6">
          <input
            name="name"
            value={form.name}
            onChange={handleInputChange}
            placeholder="NFT Name"
            className="w-full p-3 rounded-xl bg-[#151b22] border border-gray-700 text-white outline-none"
          />
          <textarea
            name="description"
            value={form.description}
            onChange={handleInputChange}
            placeholder="Description"
            rows={3}
            className="w-full p-3 rounded-xl bg-[#151b22] border border-gray-700 text-white outline-none"
          />
          <input
            name="price"
            value={form.price}
            onChange={handleInputChange}
            placeholder="Price in ETH"
            type="number"
            step="0.001"
            className="w-full p-3 rounded-xl bg-[#151b22] border border-gray-700 text-white outline-none"
          />
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={isUploading}
          className={`w-full mt-6 py-3 rounded-xl font-medium transition
            ${isUploading
              ? "bg-gray-700 text-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white"}
          `}
        >
          {isUploading ? "Minting..." : "Mint & List NFT"}
        </button>
      </div>
    </div>
  );
}
