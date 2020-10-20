import { createCanvas, loadImage } from 'canvas';

/**
 * Improve the user profile image by potentially reducing its size and adding a mask.
 * Using `canvas` is necessary for unit testing done in Node.js.
 * @param src The base64 source of a profile image.
 * @param imageSize The image size to output at, allowing the email signature to be smaller.
 * @param addCircleMask Whether or not to mask the image with a circle.
 */
export async function optimizeImage(src: string, imageSize: number, addCircleMask: boolean) {
  // Create a new canvas for drawing.
  const canvas = createCanvas(imageSize, imageSize);
  const ctx = canvas.getContext('2d');
  const img = await loadImage(src);

  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  if (addCircleMask) {
    ctx.globalCompositeOperation = 'destination-in';
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(
      canvas.width * 0.5, // x
      canvas.height * 0.5, // y
      canvas.width * 0.5, // Radius
      0, // Start angle
      2 * Math.PI // End angle
    );
    ctx.fill();
  }

  // Return the base64 version of the canvas.
  return canvas.toDataURL();
}
