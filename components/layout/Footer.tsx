import Link from "next/link";
import { CookingPot, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-bep-border bg-bep-dim/60 px-4 pb-28 pt-10 sm:px-6 lg:pb-10 lg:pt-12">
      <div className="mx-auto grid max-w-[1200px] gap-8 md:grid-cols-[1.4fr_1fr]">
        <div className="max-w-xl">
          <Link href="/" className="inline-flex min-h-11 items-center gap-2 text-lg font-bold text-bep-ink">
            <CookingPot size={22} className="text-bep-primary-dark" /> Bếp Nhà Mình
          </Link>
          <p className="mt-2 text-sm leading-6 text-bep-smoke">
            Góc nhỏ lưu giữ và chia sẻ hương vị bữa cơm gia đình Việt, ấm cúng và giản dị.
          </p>
          <p className="mt-3 text-xs font-medium text-bep-smoke">Website cá nhân, phi thương mại. Không bán hàng, không quảng cáo.</p>
        </div>
        <div className="flex flex-col gap-3 text-sm text-bep-smoke md:items-end">
          <p className="font-semibold text-bep-ink">Liên hệ &amp; trò chuyện</p>
          <Link href="/cong-thuc" className="min-h-11 content-center text-bep-primary-dark hover:underline">Khám phá công thức</Link>
          <Link href="/hom-nay-an-gi" className="min-h-11 content-center text-bep-primary-dark hover:underline">Hôm nay ăn gì?</Link>
          <a className="min-h-11 content-center text-bep-primary-dark hover:underline" href="mailto:thanhthanhnguyenthi467@gmail.com">
            thanhthanhnguyenthi467@gmail.com
          </a>
          <span aria-disabled="true" className="text-bep-smoke">Chính sách riêng tư đầy đủ: sắp mở</span>
        </div>
      </div>
      <div className="mx-auto mt-8 flex max-w-[1200px] flex-col gap-2 border-t border-bep-border pt-5 text-xs leading-5 text-bep-smoke md:flex-row md:justify-between">
        <p>© 2026 Bếp Nhà Mình. Nấu với trọn vẹn yêu thương.</p>
        <p className="inline-flex items-center gap-1"><Heart size={14} /> Website dùng GA4 để đo lượt truy cập và người quay lại.</p>
      </div>
    </footer>
  );
}
