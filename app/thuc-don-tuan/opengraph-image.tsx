import { createOgImage } from "@/lib/og-image";

export const alt = "Thực đơn tuần — Gợi ý mâm cơm tại Bếp Nhà Mình";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return createOgImage("Thực đơn tuần", "Bảy ngày đổi vị cho bữa cơm gia đình Việt");
}
