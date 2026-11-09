import type { Metadata } from "next";
import Link from "next/link";
import { CookingPot, HeartHandshake } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { MobileNav } from "@/components/layout/MobileNav";
import { Footer } from "@/components/layout/Footer";
import { siteConfig } from "@/lib/site-config";

const introduction = siteConfig.introduction;

export const metadata: Metadata = {
  title: "Về Bếp Nhà Mình | Bếp Nhà Mình",
  description: introduction.lead,
  alternates: { canonical: "/gioi-thieu" },
};

export default function AboutPage() {
  const sections = [
    { heading: introduction.creatorHeading, body: introduction.creator },
    { heading: introduction.reasonHeading, body: introduction.reason },
    { heading: introduction.wishHeading, body: introduction.wish },
  ].filter(({ heading, body }) => heading.trim() && body.trim());

  return <><Header active="privacy" /><main className="pt-16 lg:pt-20"><div className="mx-auto max-w-[1200px] px-4 pb-16 pt-6 sm:px-6 lg:px-8 lg:pt-10">
    <nav aria-label="Đường dẫn" className="mb-6 text-sm text-bep-smoke"><Link href="/" className="bep-link bep-crumb text-bep-primary-dark">Trang chủ</Link> / Về Bếp Nhà Mình</nav>
    <header className="relative overflow-hidden rounded-bep-lg bg-bep-primary-light p-6 sm:p-8 lg:p-10"><div className="absolute -right-16 -top-16 size-52 rounded-full bg-bep-surface/40" aria-hidden="true" /><div className="relative max-w-3xl"><span className="inline-flex items-center gap-2 rounded-full bg-bep-surface px-3 py-1.5 text-sm font-semibold text-bep-herb-ink"><CookingPot size={18} aria-hidden="true" /> {introduction.eyebrow}</span><h1 className="mt-5 text-[26px] font-bold leading-[1.3] text-bep-ink lg:text-[32px]">{introduction.title}</h1><p className="mt-4 text-base leading-7 text-bep-smoke">{introduction.lead}</p></div></header>
    <div className="mt-8 grid items-start gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(240px,1fr)]"><article className="rounded-bep-lg bg-bep-surface p-5 shadow-bep-card sm:p-8"><div className="mb-7 rounded-bep-md bg-bep-dim p-5"><p className="flex items-center gap-2 font-semibold text-bep-primary-dark"><CookingPot size={20} aria-hidden="true" /> Bếp mở cửa cho mọi người</p><p className="mt-2 text-sm leading-7 text-bep-smoke">Bạn có thể tìm món, góp công thức, đặt câu hỏi và chia sẻ kinh nghiệm nấu ăn cùng những người ghé bếp.</p></div>{sections.map(({ heading, body }, index) => <section key={heading} className={index === sections.length - 1 ? "pt-4" : "border-b border-bep-border py-6"}><h2 className="text-xl font-semibold text-bep-ink">{heading}</h2><p className="mt-3 text-sm leading-7 text-bep-smoke">{body}</p></section>)}</article><aside className="rounded-bep-lg bg-bep-herb-light p-6"><h2 className="flex items-center gap-2 text-lg font-semibold text-bep-herb-ink"><HeartHandshake size={21} aria-hidden="true" /> Cùng giữ lửa bếp nhà</h2><p className="mt-3 text-sm leading-7 text-bep-smoke">Mỗi lời góp ý và mỗi món ăn được chia sẻ đều giúp góc bếp này thêm gần gũi.</p><Link href="/hoi-bep" className="bep-link mt-3 inline-flex min-h-11 items-center rounded-bep-sm text-sm font-semibold text-bep-primary-dark">Ghé Hỏi bếp →</Link></aside></div>
  </div></main><Footer /><MobileNav active="privacy" /></>;
}
