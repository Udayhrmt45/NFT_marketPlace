export function resolveIPFS(url) {
    if (!url) return "";
    if (url.startsWith("ipfs://")) {
      return url.replace("ipfs://", "https://gateway.pinata.cloud/ipfs/");
    }
    return url;
  }
  
  export function getMediaType(contentType) {
    if (!contentType) return "unknown";
    if (contentType.startsWith("image")) return "image";
    if (contentType.startsWith("video")) return "video";
    if (contentType.startsWith("audio")) return "audio";
    return "unknown";
  }
  