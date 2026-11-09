import { createOgImage } from "@/lib/og-image";

export const alt = "Bếp Nhà Mình — Cộng đồng nấu ăn Việt";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return createOgImage("Hương vị bếp nhà Việt", "Công thức gần gũi, chuyện bếp sẻ chia mỗi ngày");
}
