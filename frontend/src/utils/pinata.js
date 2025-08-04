import axios from "axios";

const PINATA_API_KEY = process.env.NEXT_PUBLIC_PINATA_API_KEY;
const PINATA_SECRET_API_KEY = process.env.NEXT_PUBLIC_PINATA_SECRET;

const PINATA_BASE_URL = "https://api.pinata.cloud/pinning";

export const uploadToIPFS = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const res = await axios.post(`${PINATA_BASE_URL}/pinFileToIPFS`, formData, {
      maxContentLength: "Infinity",
      headers: {
        "Content-Type": "multipart/form-data",
        pinata_api_key: PINATA_API_KEY,
        pinata_secret_api_key: PINATA_SECRET_API_KEY,
      },
    });

    const fileHash = res.data.IpfsHash;
    return `https://gateway.pinata.cloud/ipfs/${fileHash}`;
  } catch (err) {
    console.error("Failed to upload to IPFS:", err);
    throw new Error("File upload to IPFS failed.");
  }
};

/**
 * Upload NFT metadata (name, description, file URL, media type)
 */
export const uploadMetadataToIPFS = async ({ name, description, file, type }) => {
  try {
    const metadata = {
      name,
      description,
      file,
      type,
    };

    const res = await axios.post(`${PINATA_BASE_URL}/pinJSONToIPFS`, metadata, {
      headers: {
        pinata_api_key: PINATA_API_KEY,
        pinata_secret_api_key: PINATA_SECRET_API_KEY,
      },
    });

    const metadataHash = res.data.IpfsHash;
    return `https://gateway.pinata.cloud/ipfs/${metadataHash}`;
  } catch (err) {
    console.error("Failed to upload metadata to IPFS:", err);
    throw new Error("Metadata upload to IPFS failed.");
  }
};