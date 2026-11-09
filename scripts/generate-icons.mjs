import { readFile, writeFile, mkdir } from "node:fs/promises";
import sharp from "sharp";

// The pot paths match the CookingPot icon already used in the site logo (Lucide, ISC).
const source = await readFile("public/icons/app-icon.svg");
await mkdir("public/icons", { recursive: true });

async function png(size) {
  return sharp(source).resize(size, size).png().toBuffer();
}

const [small, medium, apple, large] = await Promise.all([
  png(32), png(48), png(180), png(512),
]);
const icon192 = await png(192);

await Promise.all([
  writeFile("app/icon.png", icon192),
  writeFile("app/apple-icon.png", apple),
  writeFile("public/icons/icon-192.png", icon192),
  writeFile("public/icons/icon-512.png", large),
  writeFile("public/icons/icon-maskable-512.png", large),
]);

// ICO supports embedded PNG images. Include both common browser sizes.
const frames = [{ size: 32, image: small }, { size: 48, image: medium }];
const header = Buffer.alloc(6 + frames.length * 16);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(frames.length, 4);
let offset = header.length;
for (const [index, frame] of frames.entries()) {
  const position = 6 + index * 16;
  header.writeUInt8(frame.size, position);
  header.writeUInt8(frame.size, position + 1);
  header.writeUInt16LE(1, position + 4);
  header.writeUInt16LE(32, position + 6);
  header.writeUInt32LE(frame.image.length, position + 8);
  header.writeUInt32LE(offset, position + 12);
  offset += frame.image.length;
}
await writeFile("app/favicon.ico", Buffer.concat([header, ...frames.map((frame) => frame.image)]));
