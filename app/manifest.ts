import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Bếp Nhà Mình — Cộng đồng nấu ăn",
    short_name: "Bếp Nhà Mình",
    description: "Công thức và chuyện bếp nhà Việt, cùng chia sẻ mỗi ngày.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    lang: "vi",
    background_color: "#FBF9F5",
    theme_color: "#C2542D",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
