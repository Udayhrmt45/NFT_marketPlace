import axios from "axios";

const PINATA_API_KEY = process.env.NEXT_PUBLIC_PINATA_API_KEY;
const PINATA_SECRET_API_KEY = process.env.NEXT_PUBLIC_PINATA_SECRET;

export const uploadToIPFS = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const metadata = JSON.stringify({ name: file.name });
  formData.append("pinataMetadata", metadata);

  const options = JSON.stringify({ cidVersion: 0 });
  formData.append("pinataOptions", options);

  const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      pinata_api_key: PINATA_API_KEY,
      pinata_secret_api_key: PINATA_SECRET_API_KEY,
    },
  });

  return `https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`;
};

export const uploadJSONToIPFS = async (json) => {
  const res = await axios.post("https://api.pinata.cloud/pinning/pinJSONToIPFS", json, {
    headers: {
      pinata_api_key: PINATA_API_KEY,
      pinata_secret_api_key: PINATA_SECRET_API_KEY,
    },
  });

  return `https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`;
};
