function createImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.crossOrigin = "anonymous";
    img.src = url;
  });
}

export async function getCroppedBlob(imageSrc, cropPixels, output) {
  const image = await createImage(imageSrc);

  const canvas = document.createElement("canvas");
  canvas.width = output.width;
  canvas.height = output.height;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas context saknas");

  ctx.drawImage(
    image,
    cropPixels.x,
    cropPixels.y,
    cropPixels.width,
    cropPixels.height,
    0,
    0,
    output.width,
    output.height
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) return reject(new Error("Kunde inte skapa blob"));
        resolve(blob);
      },
      "image/jpeg",
      0.9
    );
  });
}