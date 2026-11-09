import type { Metadata } from "next";
import Link from "next/link";
import { CookingPot } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { MobileNav } from "@/components/layout/MobileNav";
import { Footer } from "@/components/layout/Footer";
import { RecipeSubmissionForm } from "@/components/submissions/RecipeSubmissionForm";

export const metadata: Metadata = {
  title: "Góp công thức | Bếp Nhà Mình",
  description: "Chia sẻ công thức bếp nhà của bạn với cộng đồng Bếp Nhà Mình.",
  alternates: { canonical: "/gui-cong-thuc" },
};

export default function SubmitRecipePage() {
  return <><Header active="submit" /><main className="pt-16 lg:pt-20"><div className="mx-auto max-w-[1240px] px-4 pb-16 pt-6 sm:px-6 lg:px-8 lg:pt-10">
    <nav aria-label="Đường dẫn" className="mb-5 text-sm text-bep-smoke"><Link href="/" className="text-bep-primary-dark hover:underline">Trang chủ</Link> / Góp công thức</nav>
    <header className="mb-8 rounded-bep-lg bg-bep-primary-light p-6 sm:p-9"><span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-sm font-semibold text-bep-herb-ink"><CookingPot size={18} /> Chia sẻ vị cơm nhà</span><h1 className="mt-4 text-[26px] font-bold leading-9 text-bep-ink lg:text-[36px]">Góp công thức — Cùng thắp lửa bếp nhà</h1><p className="mt-3 max-w-2xl text-base leading-7 text-bep-smoke">Món bạn nấu có thể thành gợi ý ấm áp cho bữa cơm của một gia đình khác.</p></header>
    <RecipeSubmissionForm />
  </div></main><Footer /><MobileNav active="submit" /></>;
}
