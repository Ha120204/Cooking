import type { Metadata } from "next";
import Link from "next/link";
import { CookingPot, MessageCircle } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { MobileNav } from "@/components/layout/MobileNav";
import { Footer } from "@/components/layout/Footer";
import { QuestionList } from "@/components/forum/QuestionList";
import { QuestionForm } from "@/components/forum/QuestionForm";

export const metadata: Metadata = {
  title: "Hỏi bếp | Bếp Nhà Mình",
  description: "Hỏi đáp chuyện nấu ăn và chia sẻ mẹo bếp nhà cùng cộng đồng.",
  alternates: { canonical: "/hoi-bep" },
};

export default function ForumPage() {
  return <><Header active="forum" /><main className="pt-16 lg:pt-20"><section className="bg-bep-primary-light px-4 py-9 sm:px-6 lg:px-8 lg:py-14"><div className="mx-auto max-w-[1200px]"><nav aria-label="Đường dẫn" className="mb-5 text-sm text-bep-smoke"><Link href="/" className="text-bep-primary-dark hover:underline">Trang chủ</Link> / Hỏi bếp</nav><span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-sm font-semibold text-bep-herb"><CookingPot size={18} /> Góc bếp cộng đồng</span><h1 className="mt-4 text-[30px] font-bold leading-tight text-bep-ink lg:text-[40px]">Hỏi bếp — Chuyện to nhỏ quanh nồi cơm</h1><p className="mt-4 max-w-2xl text-base leading-7 text-bep-smoke">Từ sơ chế đến nêm nếm, cứ hỏi điều bạn đang băn khoăn. Những người bạn bếp sẽ cùng chia sẻ kinh nghiệm thật.</p></div></section>
    <div className="mx-auto grid max-w-[1200px] gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,2fr)_minmax(300px,1fr)] lg:items-start lg:px-8"><div className="order-2 lg:order-1"><QuestionList /></div><aside className="order-1 space-y-5 lg:order-2 lg:sticky lg:top-24"><QuestionForm /><div className="hidden rounded-bep-lg bg-bep-herb-light p-5 lg:block"><h2 className="flex items-center gap-2 font-semibold text-bep-herb"><MessageCircle size={19} /> Nói chuyện thật lòng</h2><p className="mt-2 text-sm leading-6 text-bep-smoke">Viết rõ cách bạn đã thử và giữ lời lẽ thân thiện để mọi người dễ giúp nhau.</p></div></aside></div>
  </main><Footer /><MobileNav active="forum" /></>;
}
