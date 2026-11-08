import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { MobileNav } from "@/components/layout/MobileNav";
import { Footer } from "@/components/layout/Footer";
import { RandomDishPicker } from "@/components/random/RandomDishPicker";
import { getAllRecipes } from "@/lib/recipes";

export const metadata: Metadata = {
  title: "Hôm nay ăn gì? | Bếp Nhà Mình",
  description: "Chọn khẩu vị, thời gian và khẩu phần để Bếp Nhà Mình gợi ý ngẫu nhiên một món ngon từ bộ công thức bếp nhà.",
  alternates: { canonical: "/hom-nay-an-gi" },
};

export default async function RandomDishPage() {
  const recipes = (await getAllRecipes()).map(({ body: _body, ...recipe }) => recipe);
  return <><Header active="random" /><main className="pt-16 lg:pt-20"><RandomDishPicker recipes={recipes} analyticsEnabled={process.env.VERCEL_ENV === "production"} /></main><Footer /><MobileNav active="random" /></>;
}
