import type { Metadata, Viewport } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["vietnamese"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-be-vietnam",
  display: "swap",
});

const siteUrl = process.env.SITE_URL ?? "https://thanhtuyennt1405.id.vn";
const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
const isProduction = process.env.VERCEL_ENV === "production";

export const metadata: Metadata = {
  title: "Bếp Nhà Mình | Cộng đồng nấu ăn",
  description:
    "Một góc bếp Việt để cùng chia sẻ công thức, hỏi bếp và tìm cảm hứng cho bữa cơm mỗi ngày.",
  metadataBase: new URL(siteUrl),
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    siteName: "Bếp Nhà Mình",
    title: "Bếp Nhà Mình | Cộng đồng nấu ăn",
    description: "Một góc bếp Việt để cùng chia sẻ công thức, hỏi bếp và tìm cảm hứng cho bữa cơm mỗi ngày.",
    url: siteUrl,
  },
  twitter: { card: "summary_large_image" },
  appleWebApp: { capable: true, title: "Bếp Nhà Mình", statusBarStyle: "default" },
};

export const viewport: Viewport = { themeColor: "#C2542D" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi">
      <body className={beVietnamPro.variable + " font-sans antialiased"}>
        {children}
        {isProduction && gaId && /^G-[A-Z0-9]+$/.test(gaId) ? (
          <GoogleAnalytics gaId={gaId} />
        ) : null}
      </body>
    </html>
  );
}
