// Render the Everlooms app icon (gold tree on forest) to PNGs via sharp.
// Usage: node scripts/generate-icons.mjs
import { mkdirSync } from "node:fs";
import sharp from "sharp";

const leaves = [
  [24, 13, 0, 1],
  [15.5, 17.5, -38, 0.92],
  [32.5, 17.5, 38, 0.92],
  [17.5, 25, -62, 0.8],
  [30.5, 25, 62, 0.8],
  [24, 21, 0, 0.72],
];
const leafPaths = leaves
  .map(
    ([x, y, r, s]) =>
      `<path d="M0 -9 C 4 -4 4 3.5 0 8 C -4 3.5 -4 -4 0 -9 Z" fill="url(#g)" transform="translate(${x} ${y}) rotate(${r}) scale(${s})"/>`,
  )
  .join("");

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#d9c39a"/><stop offset="0.55" stop-color="#b79256"/><stop offset="1" stop-color="#8a6e4d"/>
  </linearGradient></defs>
  <rect width="512" height="512" fill="#3c4b36"/>
  <g transform="translate(256 256) scale(5.6) translate(-24 -30)">
    <path d="M24 49 V27 M24 49 C 19 52 15 50.5 12.5 46.5 M24 49 C 29 52 33 50.5 35.5 46.5" stroke="#d6c6a3" stroke-width="2.1" stroke-linecap="round" fill="none"/>
    ${leafPaths}
  </g>
</svg>`;

const buf = Buffer.from(svg);
mkdirSync("public", { recursive: true });

const targets = [
  ["src/app/icon.png", 512],
  ["src/app/apple-icon.png", 180],
  ["public/icon-192.png", 192],
  ["public/icon-512.png", 512],
];
for (const [file, size] of targets) {
  await sharp(buf).resize(size, size).png().toFile(file);
  console.log(`✓ ${file} (${size}px)`);
}
console.log("Klaar.");
