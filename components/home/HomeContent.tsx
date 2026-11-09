"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, ChefHat, Clock3, Search, Shuffle, Sparkles, UtensilsCrossed, X } from "lucide-react";
import type { RecipeFrontmatter } from "@/lib/recipe-schema";
import { RecipeCard } from "@/components/recipes/RecipeCard";
import { useFeaturedMenu } from "@/components/weekly/useFeaturedMenu";
import type { WeeklyMenuSummary } from "@/lib/weekly-selection";
import type { RecipeStat } from "@/lib/supabase/types";
import { normalizeSearch } from "@/lib/normalize";
import { scrollToResults } from "@/lib/scroll-to-results";
import { sendSearchGA } from "@/lib/search-event";
import { HeroPotIllustration } from "./HeroPotIllustration";

type HomeContentProps = {
  recipes: RecipeFrontmatter[];
  menus: WeeklyMenuSummary[];
};

const QUICK_CHIPS = ["món canh", "cơm nhà", "món chay"] as const;

export function HomeContent({ recipes, menus }: HomeContentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [inputValue, setInputValue] = useState("");
  const [activeQuery, setActiveQuery] = useState("");
  const [stats, setStats] = useState<Record<string, RecipeStat>>({});
  const [statsState, setStatsState] = useState<"loading" | "ready" | "error">("loading");
  const [statsAttempt, setStatsAttempt] = useState(0);
  const { menu, isCurrent, resolved } = useFeaturedMenu(menus);

  const resultsHeadingRef = useRef<HTMLHeadingElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Hydrate from URL ?q= on mount
  useEffect(() => {
    const q = (searchParams.get("q") ?? "").slice(0, 100);
    if (q) {
      setInputValue(q);
      setActiveQuery(q);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Filter recipes when activeQuery is set
  const searchResults = activeQuery
    ? recipes.filter((recipe) => {
        const q = normalizeSearch(activeQuery);
        return [recipe.title, recipe.description, ...recipe.tags].some(
          (value) => normalizeSearch(value).includes(q),
        );
      })
    : [];

  const menuRecipes =
    menu?.recipeSlugs
      .map((slug) => recipes.find((recipe) => recipe.slug === slug))
      .filter((recipe): recipe is RecipeFrontmatter => !!recipe) ?? [];
  const popular = [...recipes]
    .sort(
      (a, b) =>
        (stats[b.slug]?.like_count ?? 0) - (stats[a.slug]?.like_count ?? 0),
    )
    .slice(0, 3);

  // Stats fetch
  useEffect(() => {
    if (!recipes.length) {
      setStatsState("ready");
      return;
    }
    const controller = new AbortController();
    setStatsState("loading");
    fetch(
      `/api/recipes/stats?slugs=${recipes.map((recipe) => recipe.slug).join(",")}`,
      { cache: "no-store", signal: controller.signal },
    )
      .then((response) => {
        if (!response.ok) throw new Error("Không tải được lượt thích.");
        return response.json() as Promise<{ stats: RecipeStat[] }>;
      })
      .then((result) => {
        if (!controller.signal.aborted) {
          setStats(
            Object.fromEntries(
              result.stats.map((stat) => [stat.recipe_slug, stat]),
            ),
          );
          setStatsState("ready");
        }
      })
      .catch(() => {
        if (!controller.signal.aborted) setStatsState("error");
      });
    return () => controller.abort();
  }, [recipes, statsAttempt]);

  // Scroll to results when activeQuery changes (and is non-empty)
  useEffect(() => {
    if (activeQuery) {
      // Delay one tick so the DOM renders the results section
      window.requestAnimationFrame(() => {
        scrollToResults(resultsHeadingRef.current, { focus: true });
      });
    }
  }, [activeQuery]);

  const commitSearch = useCallback(
    (term: string) => {
      const trimmed = term.trim();
      if (!trimmed) return;
      searchInputRef.current?.blur();
      setActiveQuery(trimmed);
      setInputValue(trimmed);
      router.replace(trimmed ? `/?q=${encodeURIComponent(trimmed)}` : "/", {
        scroll: false,
      });

      // GA4 — count is computed from the new term
      const q = normalizeSearch(trimmed);
      const count = recipes.filter((recipe) =>
        [recipe.title, recipe.description, ...recipe.tags].some((value) =>
          normalizeSearch(value).includes(q),
        ),
      ).length;
      sendSearchGA(trimmed, count);
    },
    [router, recipes],
  );

  const clearSearch = useCallback(() => {
    setActiveQuery("");
    setInputValue("");
    router.replace("/", { scroll: false });
    window.requestAnimationFrame(() => {
      scrollToResults(searchInputRef.current, { focus: true });
    });
  }, [router]);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!inputValue.trim()) return;
    searchInputRef.current?.blur();
    commitSearch(inputValue);
  }

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-bep-dim/70 px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="mx-auto grid max-w-[1200px] items-center gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="relative z-10">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-bep-herb-light px-3 py-1.5 text-sm font-semibold text-bep-herb-ink"><Sparkles size={17} /> Chào mừng đến bếp nhà</span>
            <h1 className="max-w-2xl text-[32px] font-bold leading-[1.25] tracking-tight text-bep-ink sm:text-4xl lg:text-5xl">Mỗi bữa cơm là một câu chuyện yêu thương</h1>
            <p className="mt-5 max-w-xl text-base leading-[1.65] text-bep-smoke">Cùng nhau tìm món ngon dễ làm, chia sẻ bí quyết và giữ hương vị thân quen trong căn bếp Việt.</p>
            <form onSubmit={handleSubmit} className="bep-field-frame mt-8 flex min-h-14 max-w-xl items-center gap-2 rounded-bep-md border border-bep-border bg-bep-surface p-1.5 pl-4 shadow-bep-card">
              <Search size={21} className="shrink-0 text-bep-primary-dark" />
              <label htmlFor="home-search" className="sr-only">Tìm công thức</label>
              <input ref={searchInputRef} id="home-search" type="search" value={inputValue} onChange={(event) => setInputValue(event.target.value)} placeholder="Tìm món canh chua, thịt kho, gỏi cuốn..." className="scroll-mt-header w-full min-w-0 bg-transparent text-base text-bep-ink placeholder:text-bep-smoke outline-none" />
              {inputValue && <button type="button" onClick={clearSearch} aria-label="Xóa tìm kiếm" className="bep-action bep-action-muted flex size-10 shrink-0 items-center justify-center rounded-full text-bep-smoke hover:text-bep-primary-dark"><X size={18} /></button>}
              <button type="submit" aria-label="Tìm kiếm" className="bep-action bep-action-primary flex min-h-11 shrink-0 items-center justify-center gap-1.5 rounded-bep-md bg-bep-primary px-4 text-sm font-semibold text-white shadow-sm hover:bg-bep-primary-dark">
                <Search size={16} />
                <span className="hidden sm:inline">Tìm món</span>
                <span className="sm:hidden">Tìm</span>
              </button>
            </form>
            <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-bep-smoke">
              <span>Tìm nhanh:</span>
              {QUICK_CHIPS.map((tag) => <button key={tag} type="button" onClick={() => { setInputValue(tag); commitSearch(tag); }} aria-pressed={activeQuery === tag} className={"bep-action min-h-11 rounded-full border px-3 text-bep-primary-dark hover:border-bep-primary-dark " + (activeQuery === tag ? "border-bep-primary-dark bg-bep-primary-light font-semibold" : "border-bep-border bg-bep-surface")}>{tag}</button>)}
            </div>
          </div>
          <div className="relative hidden min-h-[340px] items-center justify-center lg:flex" aria-hidden="true">
            <HeroPotIllustration />
            <div className="absolute bottom-4 right-4 rounded-bep-lg bg-bep-surface p-4 shadow-bep-card"><span className="text-sm font-semibold text-bep-ink">Ấm bụng, ấm lòng ♡</span></div>
          </div>
        </div>
      </section>

      {/* ── Search results (only when activeQuery is set) ── */}
      {activeQuery && (
        <section id="ket-qua-tim-kiem" className="scroll-mt-header mx-auto max-w-[1240px] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <h2 ref={resultsHeadingRef} tabIndex={-1} className="scroll-mt-header text-2xl font-bold leading-8 text-bep-ink outline-none">
              Kết quả cho &ldquo;{activeQuery}&rdquo; <span className="text-lg font-semibold text-bep-smoke">({searchResults.length} món)</span>
            </h2>
            <div className="flex items-center gap-3">
              <button type="button" onClick={clearSearch} className="bep-action bep-action-muted inline-flex min-h-11 items-center gap-1 rounded-bep-md px-3 text-sm font-semibold text-bep-primary-dark"><X size={16} /> Xóa tìm kiếm</button>
              <Link href={`/cong-thuc?q=${encodeURIComponent(activeQuery)}`} className="bep-link inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-bep-primary-dark">Xem tất cả ở trang Công thức <ArrowRight size={16} /></Link>
            </div>
          </div>
          <div aria-live="polite" className="sr-only">
            {searchResults.length > 0
              ? `Tìm thấy ${searchResults.length} món cho "${activeQuery}".`
              : `Không tìm thấy món nào cho "${activeQuery}".`}
          </div>
          {searchResults.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
              {searchResults.map((recipe) => (
                <RecipeCard key={recipe.slug} recipe={recipe} />
              ))}
            </div>
          ) : (
            <div className="rounded-bep-lg border border-bep-border bg-bep-surface px-6 py-12 text-center">
              <ChefHat size={42} className="mx-auto text-bep-primary-dark" />
              <h3 className="mt-3 text-lg font-semibold">Chưa tìm thấy món phù hợp</h3>
              <p className="mt-2 text-sm text-bep-smoke">Thử tìm với từ khóa khác hoặc chọn gợi ý bên dưới nhé.</p>
              <div className="mt-5 flex flex-wrap justify-center gap-2">
                {QUICK_CHIPS.filter((tag) => tag !== activeQuery).map((tag) => (
                  <button key={tag} type="button" onClick={() => { setInputValue(tag); commitSearch(tag); }} className="bep-action min-h-11 rounded-full border border-bep-border bg-bep-surface px-3 text-sm text-bep-primary-dark hover:border-bep-primary-dark">{tag}</button>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {/* ── Công thức mới ── */}
      <section id="cong-thuc-moi" className="mx-auto max-w-[1240px] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div><p className="mb-1 text-sm font-semibold text-bep-primary-dark">HƯƠNG VỊ MỚI</p><h2 className="text-2xl font-bold leading-8 text-bep-ink lg:text-[32px]">Công thức mới</h2></div>
          <Link href="/cong-thuc" className="hidden min-h-11 items-center gap-1 text-sm font-semibold text-bep-primary-dark sm:inline-flex">Xem tất cả <ArrowRight size={18} /></Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">{recipes.map((recipe, index) => <RecipeCard key={recipe.slug} recipe={recipe} eagerImage={index === 0} />)}</div>
      </section>

      {/* ── Hôm nay ăn gì ── */}
      <section className="bg-bep-dim px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto grid max-w-[1200px] items-center gap-8 lg:grid-cols-2">
          <div><span className="inline-flex items-center gap-2 text-sm font-semibold text-bep-primary-dark"><Shuffle size={18} /> GỢI Ý CHO BẠN</span><h2 className="mt-3 text-[32px] font-bold leading-10 text-bep-ink">Hôm nay ăn gì?</h2><p className="mt-4 max-w-lg text-base leading-7 text-bep-smoke">Chưa biết nấu món gì cho bữa cơm hôm nay? Để bếp nhà gợi ý một món bất ngờ nhé.</p><Link href="/hom-nay-an-gi" className="bep-action bep-action-primary mt-6 inline-flex min-h-11 items-center gap-2 rounded-bep-md bg-bep-primary px-6 font-semibold text-white"><Shuffle size={18} /> Gợi ý món ngẫu nhiên</Link></div>
          <div className="rounded-bep-lg bg-bep-surface p-6 shadow-bep-card sm:p-8"><div className="mb-4 flex size-12 items-center justify-center rounded-full bg-bep-primary-light text-bep-primary-dark"><UtensilsCrossed size={24} /></div><p className="text-sm font-semibold text-bep-herb-ink">MÓN BẾP NHÀ GỢI Ý</p><h3 className="mt-2 text-xl font-semibold text-bep-ink">Chọn món theo khẩu vị của bạn</h3><p className="mt-2 text-sm leading-6 text-bep-smoke">Lọc theo loại món, thời gian và khẩu phần rồi bốc một công thức từ gian bếp.</p><Link href="/hom-nay-an-gi" className="mt-4 inline-flex min-h-11 items-center gap-1 font-semibold text-bep-primary-dark">Bắt đầu chọn món <ArrowRight size={17} /></Link></div>
        </div>
      </section>

      {/* ── Được yêu thích ── */}
      <section className="mx-auto max-w-[1240px] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mb-6"><p className="mb-1 text-sm font-semibold text-bep-primary-dark">MÓN NGON QUEN THUỘC</p><h2 className="text-2xl font-bold text-bep-ink lg:text-[32px]">Được yêu thích trong bếp nhà</h2><p className="mt-2 text-sm text-bep-smoke">Số lượt thích và đánh giá được cập nhật từ cộng đồng.</p></div>
        {statsState === "loading" ? (
          <div role="status" aria-label="Đang tải món được yêu thích">
            <span className="sr-only">Đang tải món được yêu thích</span>
            <div aria-hidden="true" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[0, 1, 2].map((item) => <div key={item} className="flex h-32 overflow-hidden rounded-bep-md bg-bep-surface shadow-bep-card"><div className="w-28 shrink-0 animate-pulse bg-bep-border sm:w-36" /><div className="flex flex-1 flex-col gap-3 p-4"><div className="h-5 w-4/5 animate-pulse rounded-bep-sm bg-bep-dim" /><div className="h-4 w-2/3 animate-pulse rounded-bep-sm bg-bep-dim" /><div className="mt-auto h-4 w-1/2 animate-pulse rounded-bep-sm bg-bep-dim" /></div></div>)}
            </div>
          </div>
        ) : statsState === "error" ? (
          <div role="alert" className="rounded-bep-md border border-bep-border bg-bep-surface p-5 text-sm text-bep-smoke">Chưa tải được món được yêu thích. <button type="button" onClick={() => setStatsAttempt((attempt) => attempt + 1)} className="bep-action bep-action-muted ml-2 min-h-11 rounded-bep-md px-3 font-semibold text-bep-primary-dark">Thử lại</button></div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{popular.map((recipe) => <RecipeCard key={recipe.slug} recipe={recipe} compact />)}</div>
        )}
      </section>

      {/* ── Thực đơn tuần ── */}
      <section className="bg-bep-dim/70 px-4 py-12 sm:px-6 lg:px-8 lg:py-16"><div className="mx-auto max-w-[1200px]"><div className="mb-6"><p className="mb-1 text-sm font-semibold text-bep-primary-dark">{resolved ? (isCurrent ? "THỰC ĐƠN TUẦN NÀY" : "THỰC ĐƠN GẦN NHẤT") : "THỰC ĐƠN NỔI BẬT"}</p><h2 className="text-2xl font-bold text-bep-ink lg:text-[32px]">{menu?.title ?? "Thực đơn tuần"}</h2><p className="mt-2 text-sm text-bep-smoke">{menu?.summary ?? "Thực đơn mới sẽ sớm có mặt."}</p></div><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{menuRecipes.map((recipe, index) => <div key={recipe.slug} className="rounded-bep-md bg-bep-surface p-4 shadow-bep-card"><span className="text-xs font-semibold text-bep-herb-ink">MÓN {index + 1}</span><h3 className="mt-2 text-lg font-semibold text-bep-ink">{recipe.title}</h3><p className="mt-2 flex items-center gap-1 text-sm text-bep-smoke"><Clock3 size={16} /> {recipe.cookTime} phút</p><Link href={"/cong-thuc/" + recipe.slug} className="mt-3 inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-bep-primary-dark">Xem món <ArrowRight size={16} /></Link></div>)}</div><Link href={menu ? "/thuc-don-tuan/" + menu.slug : "/thuc-don-tuan"} className="bep-action bep-action-primary mt-6 inline-flex min-h-11 items-center gap-2 rounded-bep-md bg-bep-primary px-5 font-semibold text-white">Xem thực đơn tuần <ArrowRight size={18} /></Link></div></section>
    </>
  );
}
