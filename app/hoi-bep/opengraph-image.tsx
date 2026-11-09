import { createOgImage } from "@/lib/og-image";

export const alt = "Hỏi bếp — Cùng hỏi đáp chuyện nấu ăn tại Bếp Nhà Mình";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return createOgImage("Hỏi bếp", "Hỏi thật lòng, chia sẻ mẹo hay từ gian bếp nhà");
}
