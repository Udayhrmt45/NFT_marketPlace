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
  const { createSale } = useNFT();

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (newFile) => {
    setFile(newFile);
    setPreviewUrl(URL.createObjectURL(newFile));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => setDragActive(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleBrowse = (e) => {
    if (e.target.files.length > 0) {
      handleFileChange(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    const loading = toast.loading("Uploading and minting NFT...");

    try {
      if (!file || !form.name || !form.description || !form.price) {
        toast.error("All fields are required.", { id: loading });
        return;
      }

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
    } catch (error) {
      console.error(error);
      toast.error("Minting failed.", { id: loading });
    }
  };

  const renderPreview = () => {
    if (!previewUrl || !file) return null;
    if (file.type.startsWith("image")) {
      return <img src={previewUrl} alt="Preview" className="max-w-full h-48 object-contain mb-4" />;
    } else if (file.type.startsWith("audio")) {
      return <audio controls className="w-full mb-4"><source src={previewUrl} /></audio>;
    } else if (file.type.startsWith("video")) {
      return <video controls className="w-full h-48 mb-4"><source src={previewUrl} /></video>;
    } else {
      return <p className="text-sm mb-4">{file.name}</p>;
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 border rounded-lg shadow-md bg-white">
      <h2 className="text-2xl font-bold mb-4">Create New NFT</h2>

      <label className="block mb-2 font-medium">Upload File (image/audio/video):</label>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`w-full p-6 border-2 border-dashed rounded cursor-pointer transition ${
          dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
        }`}
      >
        <p className="text-center text-gray-600">
          {file ? "File Selected" : "Drag & drop a file here or click to browse"}
        </p>
        <input
          type="file"
          accept="image/*,audio/*,video/*"
          onChange={handleBrowse}
          className="hidden"
          id="fileInput"
        />
      </div>

      <div
        onClick={() => document.getElementById("fileInput").click()}
        className="text-center text-blue-600 cursor-pointer my-2 text-sm"
      >
        {file ? "Change File" : "Browse Files"}
      </div>

      {renderPreview()}

      <input
        name="name"
        value={form.name}
        onChange={handleInputChange}
        placeholder="NFT Name"
        className="block w-full mb-4 p-2 border rounded"
      />

      <textarea
        name="description"
        value={form.description}
        onChange={handleInputChange}
        placeholder="NFT Description"
        className="block w-full mb-4 p-2 border rounded"
      />

      <input
        name="price"
        value={form.price}
        onChange={handleInputChange}
        placeholder="Price in ETH"
        type="number"
        className="block w-full mb-4 p-2 border rounded"
      />

      <button
        onClick={handleSubmit}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full"
      >
        Mint & List NFT
      </button>
    </div>
  );
}
