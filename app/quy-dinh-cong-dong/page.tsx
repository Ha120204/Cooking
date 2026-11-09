import type { Metadata } from "next";
import Link from "next/link";
import { CookingPot, Mail, ShieldCheck } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { MobileNav } from "@/components/layout/MobileNav";
import { Footer } from "@/components/layout/Footer";
import { siteConfig } from "@/lib/site-config";

const email = siteConfig.footer.contact.email.value;

export const metadata: Metadata = {
  title: "Quy định cộng đồng | Bếp Nhà Mình",
  description: "Cách cùng chia sẻ công thức, trò chuyện và tôn trọng bản quyền tại Bếp Nhà Mình.",
  alternates: { canonical: "/quy-dinh-cong-dong" },
};

const rules = [
  { title: "Tôn trọng nhau", body: "Góp ý lịch sự, tập trung vào món ăn và kinh nghiệm nấu nướng. Không công kích hay xúc phạm người khác." },
  { title: "Không quảng cáo hoặc spam", body: "Không đăng nội dung bán hàng, quảng cáo, đường dẫn không liên quan hoặc lặp lại nội dung để làm phiền cộng đồng." },
  { title: "Tôn trọng bản quyền", body: "Chỉ chia sẻ công thức và hình ảnh bạn tự tạo hoặc có quyền sử dụng. Nếu dùng nguồn được cho phép, hãy ghi công rõ ràng." },
  { title: "Hậu kiểm nội dung", body: "Bình luận, câu hỏi và câu trả lời xuất hiện ngay sau khi gửi. Nội dung vi phạm có thể bị ẩn; công thức đóng góp được xem xét trước khi đăng thành bài." },
];

export default function CommunityRulesPage() {
  return <><Header active="privacy" /><main className="pt-16 lg:pt-20"><div className="mx-auto max-w-[1200px] px-4 pb-16 pt-6 sm:px-6 lg:px-8 lg:pt-10">
    <nav aria-label="Đường dẫn" className="mb-6 text-sm text-bep-smoke"><Link href="/" className="bep-link bep-crumb text-bep-primary-dark">Trang chủ</Link> / Quy định cộng đồng</nav>
    <header className="relative overflow-hidden rounded-bep-lg bg-bep-primary-light p-6 sm:p-8 lg:p-10"><div className="absolute -right-16 -top-16 size-52 rounded-full bg-bep-surface/40" aria-hidden="true" /><div className="relative max-w-3xl"><span className="inline-flex items-center gap-2 rounded-full bg-bep-surface px-3 py-1.5 text-sm font-semibold text-bep-herb-ink"><ShieldCheck size={18} aria-hidden="true" /> Cùng giữ bếp vui</span><h1 className="mt-5 text-[26px] font-bold leading-[1.3] text-bep-ink lg:text-[32px]">Quy định cộng đồng</h1><p className="mt-4 text-base leading-7 text-bep-smoke">Một vài điều giản dị để mọi người cùng chia sẻ món ngon trong không khí thân thiện, an toàn và tôn trọng nhau.</p></div></header>
    <div className="mt-8 grid items-start gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(240px,1fr)]"><article className="rounded-bep-lg bg-bep-surface p-5 shadow-bep-card sm:p-8"><div className="mb-7 rounded-bep-md bg-bep-dim p-5"><p className="flex items-center gap-2 font-semibold text-bep-primary-dark"><CookingPot size={20} aria-hidden="true" /> Cùng nhau nấu và học hỏi</p><p className="mt-2 text-sm leading-7 text-bep-smoke">Bếp Nhà Mình là website cá nhân, phi thương mại. Mọi người có thể góp ý, hỏi đáp và chia sẻ cách nấu theo trải nghiệm của mình.</p></div>{rules.map((rule, index) => <section key={rule.title} className={index === rules.length - 1 ? "pt-4" : "border-b border-bep-border py-6"}><h2 className="text-xl font-semibold text-bep-ink">{String(index + 1).padStart(2, "0")}. {rule.title}</h2><p className="mt-3 text-sm leading-7 text-bep-smoke">{rule.body}</p></section>)}</article><aside className="rounded-bep-lg bg-bep-herb-light p-6"><h2 className="flex items-center gap-2 text-lg font-semibold text-bep-herb-ink"><Mail size={21} aria-hidden="true" /> Yêu cầu gỡ bài</h2><p className="mt-3 text-sm leading-7 text-bep-smoke">Nếu thấy nội dung vi phạm hoặc muốn yêu cầu gỡ bài liên quan đến mình, hãy gửi link bài và lý do qua email.</p>{email && <a href={`mailto:${email}`} className="bep-link mt-3 inline-flex min-h-11 items-center break-all rounded-bep-sm text-sm font-semibold text-bep-primary-dark underline underline-offset-2">{email}</a>}</aside></div>
  </div></main><Footer /><MobileNav active="privacy" /></>;
}
