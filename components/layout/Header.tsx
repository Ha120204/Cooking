import Link from "next/link";
import { ChefHat, CookingPot, Search, Sparkles } from "lucide-react";

type HeaderProps = { active?: "home" | "recipe" | "random" | "weekly" | "privacy" };

export function Header({ active = "home" }: HeaderProps) {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-bep-border/70 bg-bep-surface/90 shadow-bep-card backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1240px] items-center justify-between gap-6 px-4 sm:px-6 lg:h-20 lg:px-8">
        <Link href="/" aria-label="Bếp Nhà Mình - Trang chủ" className="flex min-h-11 items-center gap-2.5">
          <span className="flex size-10 items-center justify-center rounded-bep-md bg-bep-primary-light text-bep-primary-dark lg:size-11">
            <CookingPot size={23} strokeWidth={2.1} />
          </span>
          <span className="flex flex-col">
            <span className="text-base font-bold leading-5 tracking-tight text-bep-ink lg:text-xl">Bếp Nhà Mình</span>
            <span className="hidden text-xs leading-4 text-bep-smoke sm:block">Hương vị cơm nhà</span>
          </span>
        </Link>

        <nav aria-label="Điều hướng chính" className="hidden items-center gap-6 xl:flex">
          <Link href="/cong-thuc" aria-current={active === "recipe" ? "page" : undefined} className={"min-h-11 content-center text-sm font-semibold hover:text-bep-primary-dark " + (active === "recipe" ? "text-bep-primary-dark" : "text-bep-smoke")}>Công thức</Link>
          <Link href="/thuc-don-tuan" aria-current={active === "weekly" ? "page" : undefined} className={"min-h-11 content-center text-sm font-semibold hover:text-bep-primary-dark " + (active === "weekly" ? "text-bep-primary-dark" : "text-bep-smoke")}>Thực đơn tuần</Link>
          <span aria-disabled="true" title="Sắp mở ở M2" className="cursor-not-allowed py-2 text-sm font-semibold text-bep-smoke/75">Hỏi bếp</span>
        </nav>

        <div className="hidden items-center gap-3 sm:flex">
          <Link href="/hom-nay-an-gi" aria-current={active === "random" ? "page" : undefined} className="inline-flex min-h-11 items-center gap-2 rounded-bep-md bg-bep-dim px-4 text-sm font-semibold text-bep-primary-dark hover:bg-bep-primary-light">
            <Sparkles size={17} /> Hôm nay ăn gì?
          </Link>
          <span aria-disabled="true" className="inline-flex min-h-11 cursor-not-allowed items-center rounded-bep-md bg-bep-primary px-5 text-sm font-semibold text-white opacity-75">
            + Góp công thức
          </span>
        </div>
        <span className="flex size-11 items-center justify-center rounded-full text-bep-primary-dark sm:hidden" aria-hidden="true">
          {active === "home" ? <ChefHat size={24} /> : <Search size={22} />}
        </span>
      </div>
    </header>
  );
}
