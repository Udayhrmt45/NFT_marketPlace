import axios from "axios";

const PINATA_API_KEY = process.env.NEXT_PUBLIC_PINATA_API_KEY;
const PINATA_SECRET_API_KEY = process.env.NEXT_PUBLIC_PINATA_SECRET;
const PINATA_BASE_URL = "https://api.pinata.cloud/pinning";

/**
 * Upload a file (image/audio/video) to IPFS via Pinata
 */
export const uploadToIPFS = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const res = await axios.post(`${PINATA_BASE_URL}/pinFileToIPFS`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        pinata_api_key: PINATA_API_KEY,
        pinata_secret_api_key: PINATA_SECRET_API_KEY,
      },
    });

    const fileHash = res.data.IpfsHash;
    return {
      ipfsUrl: `ipfs://${fileHash}`,                // For smart contract metadata
      gatewayUrl: `https://gateway.pinata.cloud/ipfs/${fileHash}`, // For previews
      mimeType: file.type,
    };
  } catch (err) {
    console.error("Failed to upload to IPFS:", err);
    throw new Error("File upload to IPFS failed.");
  }
};

/**
 * Upload standard ERC721 metadata JSON to IPFS
 */
export const uploadMetadataToIPFS = async ({ name, description, image, mimeType }) => {
  try {
    const metadata = {
      name,
      description,
      image, 
      attributes: [],
      properties: {
        contentType: mimeType, // optional but helpful
      },
    };

    const res = await axios.post(`${PINATA_BASE_URL}/pinJSONToIPFS`, metadata, {
      headers: {
        "Content-Type": "application/json",
        pinata_api_key: PINATA_API_KEY,
        pinata_secret_api_key: PINATA_SECRET_API_KEY,
      },
    });

    const metadataHash = res.data.IpfsHash;
    return `ipfs://${metadataHash}`;
  } catch (err) {
    console.error("Failed to upload metadata to IPFS:", err);
    throw new Error("Metadata upload to IPFS failed.");
  }
};
