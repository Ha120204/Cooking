import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

const size = { width: 1200, height: 630 };

export async function createOgImage(title: string, subtitle: string) {
  const font = await readFile(join(process.cwd(), "assets/fonts/BeVietnamPro-Bold.ttf"));

  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", overflow: "hidden", position: "relative", padding: "64px 72px", backgroundColor: "#C2542D", color: "#FFFFFF", fontFamily: "Be Vietnam Pro" }}>
      <div style={{ position: "absolute", right: -125, top: -165, width: 600, height: 600, borderRadius: 300, backgroundColor: "#D97553", opacity: 0.65 }} />
      <div style={{ position: "absolute", right: 70, bottom: -250, width: 460, height: 460, borderRadius: 230, backgroundColor: "#9E3F1D", opacity: 0.55 }} />
      <div style={{ display: "flex", alignItems: "center", position: "relative", fontSize: 34, letterSpacing: -1 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 58, height: 58, marginRight: 18, borderRadius: 16, backgroundColor: "#F8ECE8", color: "#9E3F1D", fontSize: 31 }}>B</div>
        Bếp Nhà Mình
      </div>
      <div style={{ display: "flex", flexDirection: "column", position: "relative", maxWidth: 980 }}>
        <div style={{ width: 84, height: 8, marginBottom: 28, borderRadius: 4, backgroundColor: "#F8ECE8" }} />
        <div style={{ fontSize: 82, lineHeight: 1.17, letterSpacing: -2 }}>{title}</div>
        <div style={{ marginTop: 25, fontSize: 26, lineHeight: 1.35, color: "#F8ECE8" }}>{subtitle}</div>
      </div>
      <div style={{ position: "relative", fontSize: 22, color: "#F8ECE8" }}>thanhtuyennt1405.id.vn</div>
    </div>,
    { ...size, fonts: [{ name: "Be Vietnam Pro", data: font, style: "normal", weight: 700 }] },
  );
}
