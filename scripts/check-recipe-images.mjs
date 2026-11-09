import { access, readdir, readFile } from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";

const recipeDir = path.join(process.cwd(), "content", "recipes");
const imageDir = path.join(process.cwd(), "public", "images", "recipes");
const files = (await readdir(recipeDir)).filter((file) => file.endsWith(".mdx"));
const missing = [];

for (const file of files) {
  const { data } = matter(await readFile(path.join(recipeDir, file), "utf8"));
  const expected = `${data.slug}.jpg`;
  try {
    await access(path.join(imageDir, expected));
  } catch {
    missing.push({ title: data.title, path: `public/images/recipes/${expected}` });
  }
}

if (!missing.length) {
  console.log(`Đủ ảnh JPG cho ${files.length} công thức.`);
} else {
  console.log(`Còn thiếu ảnh thật cho ${missing.length}/${files.length} công thức (website sẽ dùng ảnh minh họa):`);
  for (const item of missing) console.log(`- ${item.title}: ${item.path}`);
}
