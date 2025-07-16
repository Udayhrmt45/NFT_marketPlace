import { useState } from "react";
import { useNFT } from "../context/NFTContext";
import { uploadToIPFS, uploadJSONToIPFS } from "../utils/pinata";
import toast from "react-hot-toast";

export default function CreateNFTForm() {
  const [file, setFile] = useState(null);
  const [form, setForm] = useState({ name: "", description: "", price: "" });
  const { createSale } = useNFT();

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const loading = toast.loading("Uploading and minting NFT...");
    try {
      if (!file || !form.name || !form.description || !form.price) {
        toast.error("All fields are required.", { id: loading });
        return;
      }

      const imageURL = await uploadToIPFS(file);
      const metadata = {
        name: form.name,
        description: form.description,
        image: imageURL,
      };

      const metadataURL = await uploadJSONToIPFS(metadata);
      await createSale(metadataURL, form.price);
      toast.success("NFT Minted Successfully!", { id: loading });

      // Reset form
      setForm({ name: "", description: "", price: "" });
      setFile(null);
    } catch (error) {
      console.error(error);
      toast.error("Minting failed.", { id: loading });
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 border rounded-lg shadow-md bg-white">
      <h2 className="text-2xl font-bold mb-4">Create New NFT</h2>

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files[0])}
        className="mb-4 w-full"
      />

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
