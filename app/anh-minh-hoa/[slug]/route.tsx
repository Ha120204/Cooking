import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { getRecipeBySlug } from "@/lib/recipes";

type Context = { params: Promise<{ slug: string }> };

export async function GET(_request: Request, { params }: Context) {
  const { slug } = await params;
  const recipe = await getRecipeBySlug(slug);
  if (!recipe) return new Response("Không tìm thấy món ăn", { status: 404 });

  const font = await readFile(path.join(process.cwd(), "assets/fonts/BeVietnamPro-Bold.ttf"));
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between", padding: "70px 80px", backgroundColor: "#FBF9F5", color: "#26211E", fontFamily: "Be Vietnam Pro" }}>
      <div style={{ position: "absolute", width: 660, height: 660, borderRadius: 330, backgroundColor: "#F8ECE8", top: 100, left: 270 }} />
      <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 16, fontSize: 30, color: "#9E3F1D" }}><span style={{ width: 46, height: 46, borderRadius: 14, backgroundColor: "#C2542D", color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center" }}>B</span>Bếp Nhà Mình</div>
      <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", maxWidth: 980 }}>
        <div style={{ display: "flex", width: 180, height: 180, alignItems: "center", justifyContent: "center", borderRadius: 90, backgroundColor: "#FFFFFF", border: "12px solid #E6DED6" }}>
          <svg width="112" height="112" viewBox="0 0 24 24" fill="none" stroke="#C2542D" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 12h20" />
            <path d="M20 12v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8" />
            <path d="m4 8 16-4" />
            <path d="m8.86 6.78-.45-1.81a2 2 0 0 1 1.45-2.43l1.94-.48a2 2 0 0 1 2.43 1.46l.45 1.8" />
          </svg>
        </div>
        <div style={{ marginTop: 44, fontSize: 76, lineHeight: 1.2, textAlign: "center", color: "#26211E" }}>{recipe.title}</div>
      </div>
      <div style={{ position: "relative", fontSize: 24, color: "#635952" }}>Ảnh minh họa đang được bổ sung</div>
    </div>,
    { width: 1200, height: 900, fonts: [{ name: "Be Vietnam Pro", data: font, weight: 700, style: "normal" }] },
  );
}
