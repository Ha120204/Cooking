"use client";

import { useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { sendGAEvent } from "@next/third-parties/google";
import { ArrowRight, ChefHat, Clock3, CookingPot, RefreshCw, Shuffle, Sparkles, Users } from "lucide-react";
import type { RecipeFrontmatter } from "@/lib/recipe-schema";
import { categoryLabel, difficultyLabel } from "@/lib/recipe-schema";
import { categories, type Category } from "@/lib/recipe-filters";
import { FavoriteButton } from "@/components/recipes/FavoriteButton";
import { RecipeCard } from "@/components/recipes/RecipeCard";
import { scrollToResults } from "@/lib/scroll-to-results";

type Time = "all" | "15" | "30" | "45" | "60";
type Portion = "all" | "2" | "3-4" | "5+";

function sendRandomEvent(slug: string) {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  if (!gaId) return;
  let attempts = 0;
  const timer = window.setInterval(() => {
    attempts += 1;
    const layer = (window as Window & { dataLayer?: unknown[] }).dataLayer;
    const configured = Array.isArray(layer) && layer.some((entry) => {
      const args = Array.from(entry as ArrayLike<unknown>);
      return args[0] === "config" && args[1] === gaId;
    });
    if (configured) {
      sendGAEvent("event", "random_dish", { recipe_slug: slug });
      window.clearInterval(timer);
    } else if (attempts >= 150) {
      window.clearInterval(timer);
    }
  }, 100);
}

export function RandomDishPicker({ recipes, analyticsEnabled }: { recipes: RecipeFrontmatter[]; analyticsEnabled: boolean }) {
  const [category, setCategory] = useState<Category | null>(null);
  const [time, setTime] = useState<Time>("all");
  const [portion, setPortion] = useState<Portion>("all");
  const [pickedSlug, setPickedSlug] = useState<string | null>(recipes.find((recipe) => recipe.slug === "dau-hu-sot-ca")?.slug ?? recipes[0]?.slug ?? null);
  const resultRef = useRef<HTMLElement>(null);
  const choices = useMemo(() => recipes.filter((recipe) => {
    if (category && recipe.category !== category) return false;
    if (time !== "all" && recipe.cookTime > Number(time)) return false;
    if (portion === "2" && recipe.servings < 2) return false;
    if (portion === "3-4" && (recipe.servings < 3 || recipe.servings > 4)) return false;
    if (portion === "5+" && recipe.servings < 5) return false;
    return true;
  }), [recipes, category, time, portion]);
  const picked = choices.find((recipe) => recipe.slug === pickedSlug) ?? null;
  const suggested = picked ? recipes.filter((recipe) => recipe.slug !== picked.slug && recipe.category !== picked.category).slice(0, 2) : [];

  function pickRandom() {
    if (!choices.length) { setPickedSlug(null); return; }
    const pool = choices.filter((recipe) => recipe.slug !== pickedSlug);
    const options = pool.length ? pool : choices;
    const recipe = options[Math.floor(Math.random() * options.length)];
    setPickedSlug(recipe.slug);
    if (analyticsEnabled) sendRandomEvent(recipe.slug);
    // On mobile, scroll to the result card
    window.requestAnimationFrame(() => {
      if (window.innerWidth < 1024 && resultRef.current) {
        scrollToResults(resultRef.current, { focus: false });
      }
    });
  }

  return <div className="mx-auto max-w-[1240px] px-4 pb-16 pt-6 sm:px-6 lg:px-8 lg:pt-10">
    <nav aria-label="Đường dẫn" className="mb-5 text-sm text-bep-smoke"><Link href="/" className="bep-link bep-crumb text-bep-primary-dark">Trang chủ</Link> / Hôm nay ăn gì?</nav>
    <div className="mb-8"><span className="inline-flex items-center gap-2 text-sm font-semibold text-bep-herb-ink"><Sparkles size={17} /> GỢI Ý TỪ GIAN BẾP</span><h1 className="mt-2 text-2xl font-bold leading-8 text-bep-ink lg:text-[32px] lg:leading-10">Hôm nay mình ăn gì đây bạn ơi?</h1><p className="mt-3 text-base leading-7 text-bep-smoke">Chọn một chút khẩu vị, bếp nhà sẽ bốc món cho bữa cơm hôm nay.</p></div>
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(300px,420px)_minmax(0,1fr)] lg:gap-8">
      <section className="rounded-bep-lg border border-bep-border bg-bep-surface p-5 shadow-bep-card sm:p-6"><h2 className="mb-5 text-xl font-semibold text-bep-ink">Tùy chọn khẩu vị</h2>
        <fieldset className="mb-6"><legend className="mb-3 text-sm font-bold text-bep-ink">Loại món</legend><div className="flex flex-wrap gap-2"><button type="button" aria-pressed={category === null} onClick={() => setCategory(null)} className={chipClass(category === null)}>Tất cả</button>{categories.map((value) => <button key={value} type="button" aria-pressed={category === value} onClick={() => setCategory(value)} className={chipClass(category === value)}>{categoryLabel[value]}</button>)}</div></fieldset>
        <fieldset className="mb-6"><legend className="mb-3 text-sm font-bold text-bep-ink">Thời gian nấu</legend><div className="flex flex-wrap gap-2">{([ ["all", "Tất cả"], ["15", "≤ 15 phút"], ["30", "≤ 30 phút"], ["45", "≤ 45 phút"], ["60", "≤ 60 phút"] ] as const).map(([value, label]) => <button key={value} type="button" aria-pressed={time === value} onClick={() => setTime(value)} className={chipClass(time === value)}>{label}</button>)}</div></fieldset>
        <fieldset className="mb-6"><legend className="mb-3 text-sm font-bold text-bep-ink">Khẩu phần</legend><div className="flex flex-wrap gap-2">{([ ["all", "Tất cả"], ["2", "2 người"], ["3-4", "3–4 người"], ["5+", "Đông người"] ] as const).map(([value, label]) => <button key={value} type="button" aria-pressed={portion === value} onClick={() => setPortion(value)} className={chipClass(portion === value)}>{label}</button>)}</div></fieldset>
        <button type="button" onClick={pickRandom} disabled={!choices.length} className="bep-action bep-action-primary inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-bep-md bg-bep-primary px-5 font-semibold text-white"><Shuffle size={20} /> Bốc món ngẫu nhiên</button><p className="mt-3 text-center text-xs text-bep-smoke">{choices.length} món phù hợp với lựa chọn của bạn</p>
        <div className="mt-6 rounded-bep-md bg-bep-herb-light p-4 text-sm leading-6 text-bep-smoke"><p className="font-semibold text-bep-herb-ink">Một chút cảm hứng</p><p className="mt-1">Bữa cơm giản dị cũng có thể thành khoảnh khắc đáng nhớ.</p></div>
      </section>
      <section ref={resultRef} aria-live="polite" className="scroll-mt-header overflow-hidden rounded-bep-lg border border-bep-border bg-bep-surface shadow-bep-card">
        {picked && choices.some((recipe) => recipe.slug === picked.slug) ? <><div className="relative aspect-[4/3] bg-bep-dim"><Image src={picked.cover} alt={"Ảnh minh họa " + picked.title} fill priority sizes="(max-width: 1024px) 100vw, 700px" className="object-contain" /><div className="absolute left-4 top-4 rounded-full bg-bep-surface/95 px-3 py-1.5 text-xs font-semibold text-bep-primary-dark shadow-bep-card">Món bếp nhà gợi ý</div><div className="absolute right-4 top-4"><FavoriteButton slug={picked.slug} title={picked.title} compact /></div></div><div className="p-5 sm:p-7"><p className="text-sm font-semibold text-bep-herb-ink">{categoryLabel[picked.category]}</p><h2 className="mt-2 text-2xl font-bold leading-8 text-bep-ink">{picked.title}</h2><div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold"><span className="inline-flex items-center gap-1 rounded-bep-sm bg-bep-dim px-2.5 py-1.5 text-bep-smoke"><Clock3 size={15} /> {picked.cookTime} phút</span><span className="inline-flex items-center gap-1 rounded-bep-sm bg-bep-herb-light px-2.5 py-1.5 text-bep-herb-ink"><CookingPot size={15} /> {difficultyLabel[picked.difficulty]}</span><span className="inline-flex items-center gap-1 rounded-bep-sm bg-bep-dim px-2.5 py-1.5 text-bep-smoke"><Users size={15} /> {picked.servings} người</span></div><p className="mt-4 text-sm leading-6 text-bep-smoke">{picked.description}</p><h3 className="mt-5 font-semibold text-bep-ink">Nguyên liệu chính</h3><ul className="mt-2 grid gap-2 text-sm text-bep-smoke sm:grid-cols-2">{picked.ingredients.slice(0, 4).map((ingredient) => <li key={ingredient.name}>• {ingredient.name}</li>)}</ul><div className="mt-6 flex flex-wrap gap-3"><Link href={"/cong-thuc/" + picked.slug} className="bep-action bep-action-primary inline-flex min-h-11 items-center gap-2 rounded-bep-md bg-bep-primary px-5 font-semibold text-white">Xem công thức <ArrowRight size={18} /></Link><button type="button" onClick={pickRandom} className="bep-action bep-action-outline inline-flex min-h-11 items-center gap-2 rounded-bep-md border border-bep-border px-5 font-semibold text-bep-primary-dark"><RefreshCw size={18} /> Gợi ý món khác</button></div></div></> : <div className="flex min-h-80 flex-col items-center justify-center p-8 text-center"><ChefHat size={48} className="text-bep-primary-dark" /><h2 className="mt-4 text-xl font-semibold">{choices.length ? "Đã chọn bộ lọc" : "Chưa có món phù hợp"}</h2><p className="mt-2 text-sm text-bep-smoke">{choices.length ? "Bấm Bốc món ngẫu nhiên để tìm món phù hợp nhé." : "Hãy đổi loại món, thời gian hoặc khẩu phần rồi thử lại nhé."}</p></div>}
      </section>
    </div>
    {picked && suggested.length > 0 && <section className="mt-12"><h2 className="mb-5 text-xl font-semibold text-bep-ink lg:text-2xl">Món ăn kèm gợi ý cho bữa cơm trọn vị</h2><div className="grid gap-4 sm:grid-cols-2">{suggested.map((recipe) => <RecipeCard key={recipe.slug} recipe={recipe} compact />)}</div></section>}
  </div>;
}

function chipClass(selected: boolean) {
  return "bep-chip min-h-11 rounded-full border px-4 text-sm font-semibold " + (selected ? "border-bep-primary bg-bep-primary-light text-bep-primary-dark" : "border-bep-border bg-bep-surface text-bep-smoke");
}
