import Link from "next/link";
import { Heart, House, Search, Soup } from "lucide-react";

type MobileNavProps = { active?: "home" | "recipe" | "random" | "weekly" | "privacy" | "forum" | "submit" };

export function MobileNav({ active = "home" }: MobileNavProps) {
  const tabs = [
    { label: "Trang chủ", icon: House, href: "/", selected: active === "home" },
    { label: "Tìm món", icon: Search, href: "/cong-thuc", selected: active === "recipe" },
    { label: "Yêu thích", icon: Heart, href: "/cong-thuc?yeu-thich=1", selected: false },
    { label: "Góc bếp", icon: Soup, href: "/hoi-bep", selected: active === "forum" },
  ] as const;

  return (
    <nav aria-label="Điều hướng di động" className="fixed inset-x-0 bottom-0 z-50 border-t border-bep-border bg-bep-surface/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-2px_16px_rgba(38,33,30,0.06)] backdrop-blur-xl lg:hidden">
      <div className="mx-auto flex h-16 max-w-lg items-center justify-around px-2">
        {tabs.map(({ label, icon: Icon, href, selected }) => {
          const className = "flex min-h-11 min-w-16 flex-col items-center justify-center gap-0.5 rounded-bep-md px-2 text-[11px] font-medium " +
            (selected ? "text-bep-primary-dark" : "text-bep-smoke");
          return <Link href={href} key={label} aria-current={selected ? "page" : undefined} className={className}>
              <Icon size={23} strokeWidth={1.8} />
              <span>{label}</span>
            </Link>;
        })}
      </div>
    </nav>
  );
}
