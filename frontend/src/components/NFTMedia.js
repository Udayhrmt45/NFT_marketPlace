// NFTMedia.js
export default function NFTMedia({ src, type }) {
  switch (type) {
    case "image":
      return <img src={src} alt="NFT Media" className="w-full rounded-lg shadow-md" />;
    case "video":
      return <video controls className="w-full rounded-lg shadow-md" preload="metadata"><source src={src} type="video/mp4" /></video>;
    case "audio":
      return <audio controls className="w-full mt-2" preload="metadata"><source src={src} type="audio/mpeg" /></audio>;
    default:
      return <div className="text-red-500 text-sm">Unsupported media type: <strong>{type}</strong></div>;
  }
}
