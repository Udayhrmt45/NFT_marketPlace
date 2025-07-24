export const addWatermark = async (file, watermarkText = "© MyNFT") => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = () => {
            const img = new Image();
            img.src = reader.result;

            img.onload = () => {
                const canvas = document.createElement("canvas");
                canvas.width = img.width;
                canvas.height = img.height;

                const ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0);

                // Add watermark
                ctx.font = `${Math.floor(img.width / 20)}px Arial`;
                ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
                ctx.textAlign = "right";
                ctx.fillText(watermarkText, img.width - 10, img.height - 10);

                canvas.toBlob(resolve, "image/png");
            };
        };

        reader.onerror = reject;
    });
};
