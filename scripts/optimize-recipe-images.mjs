import { readdir, readFile, rename, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const imageDir = path.join(process.cwd(), "public", "images", "recipes");
const sourceExts = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif", ".svg"]);
const priority = { ".jpg": 0, ".jpeg": 1, ".png": 2, ".webp": 3, ".avif": 4, ".svg": 5 };
const maxBytes = 300 * 1024;
const names = (await readdir(imageDir)).filter((name) => sourceExts.has(path.extname(name).toLowerCase()));
const groups = new Map();

for (const name of names) {
  const ext = path.extname(name).toLowerCase();
  const stem = name.slice(0, -ext.length);
  const group = groups.get(stem) ?? [];
  group.push({ name, ext });
  groups.set(stem, group);
}

for (const [stem, group] of groups) {
  group.sort((a, b) => priority[a.ext] - priority[b.ext]);
  const source = group[0].name;
  const input = await readFile(path.join(imageDir, source));
  let output;
  let quality = 80;
  while (quality >= 30) {
    output = await sharp(input).rotate().resize(1200, 900, { fit: "cover", position: "centre" }).jpeg({ quality, mozjpeg: true }).toBuffer();
    if (output.length < maxBytes) break;
    quality -= 5;
  }
  if (!output || output.length >= maxBytes) throw new Error(`${source}: không đạt dưới 300KB ở 1200×900; hãy dùng ảnh nguồn ít chi tiết hơn.`);
  const target = `${stem}.jpg`;
  const temporary = path.join(imageDir, `${target}.tmp`);
  await writeFile(temporary, output);
  await rename(temporary, path.join(imageDir, target));
  for (const item of group) if (item.name !== target) await unlink(path.join(imageDir, item.name));
  console.log(`${source} → ${target}: 1200×900, q${quality}, ${(output.length / 1024).toFixed(0)}KB`);
}

console.log(`Đã xử lý ${groups.size} ảnh. Các tệp nguồn khác đuôi .jpg đã được chuyển thành JPG.`);
