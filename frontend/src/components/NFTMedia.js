import { useState, useMemo } from "react";

export default function NFTMedia({ src, altText = "NFT Media" }) {
  const [loading, setLoading] = useState(true);

  const extension = useMemo(() => {
    try {
      return src.split(".").pop().toLowerCase().split("?")[0];
    } catch {
      return "";
    }
  }, [src]);

  const type = useMemo(() => {
    if (["jpg", "jpeg", "png", "gif", "svg", "webp"].includes(extension)) return "image";
    if (["mp4", "webm", "mov"].includes(extension)) return "video";
    if (["mp3", "wav", "m4a", "ogg"].includes(extension)) return "audio";
    if (["pdf"].includes(extension)) return "pdf";
    return "unknown";
  }, [extension]);

  const handleError = (e) => {
    e.target.onerror = null;
    e.target.src = "/fallback.png";
  };

  // Shared container (THIS is the key upgrade)
  const Container = ({ children }) => (
    <div className="relative w-full aspect-square bg-black flex items-center justify-center overflow-hidden">
      {children}
    </div>
  );

  switch (type) {
    case "image":
      return (
        <Container>
          {loading && (
            <div className="absolute inset-0 animate-pulse bg-gray-800" />
          )}
          <img
            src={src}
            alt={altText}
            onLoad={() => setLoading(false)}
            onError={handleError}
            className={`w-full h-full object-cover transition ${
              loading ? "opacity-0" : "opacity-100"
            }`}
          />
        </Container>
      );

    case "video":
      return (
        <Container>
          <video
            controls
            preload="metadata"
            className="w-full h-full object-cover"
            aria-label="NFT Video"
          >
            <source src={src} type="video/mp4" />
          </video>
        </Container>
      );

    case "audio":
      return (
        <Container>
          <div className="w-full p-4">
            <audio
              controls
              preload="metadata"
              className="w-full"
              aria-label="NFT Audio"
            >
              <source src={src} type="audio/mpeg" />
            </audio>
          </div>
        </Container>
      );

    case "pdf":
      return (
        <Container>
          <embed
            src={src}
            type="application/pdf"
            className="w-full h-full"
          />
        </Container>
      );

    default:
      return (
        <Container>
          <div className="text-gray-500 text-sm">
            Unsupported media
          </div>
        </Container>
      );
  }
}
