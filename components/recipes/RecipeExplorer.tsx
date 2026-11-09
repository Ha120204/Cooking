"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ChefHat, Heart, Search, SlidersHorizontal, X } from "lucide-react";
import type { RecipeFrontmatter } from "@/lib/recipe-schema";
import { categoryLabel, difficultyLabel } from "@/lib/recipe-schema";
import { filterRecipes, parseRecipeFilters, recipeFiltersHref, type RecipeFilters } from "@/lib/recipe-filters";
import { useFavorites } from "@/lib/favorites";
import { RecipeCard } from "./RecipeCard";
import { RecipeFilterControls, timeLabel } from "./RecipeFilterControls";
import { MobileFilterSheet } from "./MobileFilterSheet";

export function RecipeExplorer({ recipes }: { recipes: RecipeFrontmatter[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const filters = useMemo(() => parseRecipeFilters(searchParams), [searchParams]);
  const [search, setSearch] = useState(filters.q);
  const [sheetOpen, setSheetOpen] = useState(false);
  const favorites = useFavorites();

  useEffect(() => { setSearch(filters.q); }, [filters.q]);
  useEffect(() => {
    if (search === filters.q) return;
    const timer = window.setTimeout(() => router.replace(recipeFiltersHref({ ...filters, q: search }), { scroll: false }), 300);
    return () => window.clearTimeout(timer);
  }, [search, filters, router]);

  const update = useCallback((patch: Partial<RecipeFilters>) => {
    router.push(recipeFiltersHref({ ...filters, q: search, ...patch }), { scroll: false });
  }, [filters, router, search]);
  const shown = filterRecipes(recipes, { ...filters, q: search }, favorites);
  const chips: { label: string; clear: Partial<RecipeFilters> }[] = [];
  if (filters.category) chips.push({ label: categoryLabel[filters.category], clear: { category: null } });
  if (filters.difficulty) chips.push({ label: difficultyLabel[filters.difficulty], clear: { difficulty: null } });
  if (filters.time) chips.push({ label: timeLabel[filters.time], clear: { time: null } });
  if (filters.favoritesOnly) chips.push({ label: "Chỉ món đã lưu", clear: { favoritesOnly: false } });

  return <div className="mx-auto max-w-[1240px] px-4 pb-16 pt-6 sm:px-6 lg:px-8 lg:pt-10">
    <nav aria-label="Đường dẫn" className="mb-5 text-sm text-bep-smoke"><Link href="/" className="text-bep-primary-dark hover:underline">Trang chủ</Link> / Công thức</nav>
    <div className="mb-7 text-center lg:mb-10"><p className="text-sm font-semibold text-bep-herb-ink">GÓC BẾP GIA ĐÌNH</p><h1 className="mt-2 text-2xl font-bold leading-8 text-bep-ink lg:text-[32px] lg:leading-10">Công thức món ngon gia đình</h1><p className="mt-3 text-sm leading-6 text-bep-smoke">Tìm món phù hợp với khẩu vị và thời gian của bạn.</p></div>
    <label htmlFor="recipe-search" className="mx-auto mb-6 flex min-h-14 max-w-3xl items-center gap-3 rounded-bep-md border border-bep-border bg-bep-surface px-4 shadow-bep-card focus-within:border-bep-primary-dark"><Search size={21} className="shrink-0 text-bep-primary-dark" /><input id="recipe-search" type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Tìm tên món, nguyên liệu..." className="min-w-0 flex-1 bg-transparent text-base text-bep-ink outline-none placeholder:text-bep-smoke" />{search && <button type="button" onClick={() => setSearch("")} aria-label="Xóa tìm kiếm" className="flex size-11 shrink-0 items-center justify-center text-bep-primary-dark"><X size={18} /></button>}</label>
    <div className="grid gap-7 lg:grid-cols-[260px_minmax(0,1fr)]">
      <aside className="hidden self-start rounded-bep-lg border border-bep-border bg-bep-surface p-5 shadow-bep-card lg:sticky lg:top-24 lg:block"><div className="mb-5 flex items-center justify-between"><h2 className="text-lg font-bold">Bộ lọc</h2><button type="button" onClick={() => { setSearch(""); router.push("/cong-thuc", { scroll: false }); }} className="min-h-11 text-sm font-semibold text-bep-primary-dark">Thiết lập lại</button></div><RecipeFilterControls filters={filters} onChange={update} showFavorites showTip /></aside>
      <div>
        <div className="mb-4 flex flex-wrap items-center gap-3 lg:hidden"><button type="button" onClick={() => setSheetOpen(true)} className="inline-flex min-h-11 items-center gap-2 rounded-bep-md border border-bep-border bg-bep-surface px-4 font-semibold text-bep-primary-dark"><SlidersHorizontal size={18} /> Bộ lọc</button><button type="button" aria-pressed={filters.favoritesOnly} onClick={() => update({ favoritesOnly: !filters.favoritesOnly })} className={"inline-flex min-h-11 items-center gap-2 rounded-bep-md px-4 font-semibold " + (filters.favoritesOnly ? "bg-bep-primary-light text-bep-primary-dark" : "border border-bep-border bg-bep-surface text-bep-smoke")}><Heart size={17} fill={filters.favoritesOnly ? "currentColor" : "none"} /> Chỉ món đã lưu</button></div>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3"><p className="text-sm font-medium text-bep-smoke">Tìm thấy <strong className="text-bep-ink">{shown.length}</strong> công thức</p><label className="flex items-center gap-2 text-sm text-bep-smoke">Sắp xếp<select value={filters.sort} onChange={(event) => update({ sort: event.target.value as RecipeFilters["sort"] })} className="min-h-11 rounded-bep-md border border-bep-border bg-bep-surface px-2 font-semibold text-bep-ink"><option value="moi-nhat">Mới nhất</option><option value="nhanh-nhat">Nấu nhanh</option><option value="ten-mon">Tên món</option></select></label></div>
        {(chips.length > 0 || search) && <div className="mb-5 flex flex-wrap items-center gap-2">{search && <button type="button" onClick={() => { setSearch(""); update({ q: "" }); }} className="inline-flex min-h-11 items-center gap-1 rounded-full bg-bep-primary-light px-3 text-sm font-semibold text-bep-primary-dark">“{search}” <X size={16} /></button>}{chips.map((chip) => <button key={chip.label} type="button" onClick={() => update(chip.clear)} className="inline-flex min-h-11 items-center gap-1 rounded-full bg-bep-primary-light px-3 text-sm font-semibold text-bep-primary-dark">{chip.label} <X size={16} /></button>)}<button type="button" onClick={() => { setSearch(""); router.push("/cong-thuc", { scroll: false }); }} className="min-h-11 px-2 text-sm font-semibold text-bep-primary-dark underline underline-offset-2">Xóa tất cả</button></div>}
        {shown.length ? <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{shown.map((recipe) => <RecipeCard key={recipe.slug} recipe={recipe} />)}</div> : <div className="rounded-bep-lg border border-bep-border bg-bep-surface px-6 py-12 text-center"><ChefHat size={44} className="mx-auto text-bep-primary-dark" /><h2 className="mt-3 text-xl font-semibold">Gian bếp này chưa có món phù hợp</h2><p className="mt-2 text-sm text-bep-smoke">Thử bớt bộ lọc hoặc tìm món khác nhé.</p><button type="button" onClick={() => { setSearch(""); router.push("/cong-thuc", { scroll: false }); }} className="mt-5 min-h-11 rounded-bep-md bg-bep-primary px-5 font-semibold text-white">Xem tất cả công thức</button></div>}
      </div>
    </div>
    <MobileFilterSheet key={sheetOpen ? "open" : "closed"} open={sheetOpen} filters={filters} onClose={() => setSheetOpen(false)} onApply={(next) => { setSheetOpen(false); update({ ...next, q: search }); }} />
  </div>;
}
