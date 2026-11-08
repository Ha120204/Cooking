"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, ChefHat, Clock3, CookingPot, Search, Shuffle, Sparkles, UtensilsCrossed } from "lucide-react";
import type { RecipeFrontmatter } from "@/lib/recipe-schema";
import { RecipeCard } from "@/components/recipes/RecipeCard";

type HomeContentProps = {
  recipes: RecipeFrontmatter[];
  menu: { title: string; summary: string; weekLabel: string; recipeSlugs: string[] } | null;
  challenge: { title: string; summary: string; weekLabel: string } | null;
};

export function HomeContent({ recipes, menu, challenge }: HomeContentProps) {
  const [query, setQuery] = useState("");
  const shown = recipes.filter((recipe) =>
    [recipe.title, recipe.description, ...recipe.tags].some((value) => value.toLocaleLowerCase("vi").includes(query.toLocaleLowerCase("vi"))),
  );
  const menuRecipes = menu?.recipeSlugs.map((slug) => recipes.find((recipe) => recipe.slug === slug)).filter((recipe): recipe is RecipeFrontmatter => !!recipe) ?? [];

  return (
    <>
      <section className="relative overflow-hidden bg-bep-dim/70 px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="mx-auto grid max-w-[1200px] items-center gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="relative z-10">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-bep-herb-light px-3 py-1.5 text-sm font-semibold text-bep-herb"><Sparkles size={17} /> Chào mừng đến bếp nhà</span>
            <h1 className="max-w-2xl text-[32px] font-bold leading-[1.25] tracking-tight text-bep-ink sm:text-4xl lg:text-5xl">Mỗi bữa cơm là một câu chuyện yêu thương</h1>
            <p className="mt-5 max-w-xl text-base leading-[1.65] text-bep-smoke">Cùng nhau tìm món ngon dễ làm, chia sẻ bí quyết và giữ hương vị thân quen trong căn bếp Việt.</p>
            <label htmlFor="home-search" className="mt-8 flex min-h-14 max-w-xl items-center gap-3 rounded-bep-md border border-bep-border bg-bep-surface px-4 shadow-bep-card focus-within:border-bep-primary-dark">
              <Search size={22} className="shrink-0 text-bep-primary-dark" />
              <input id="home-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm món canh chua, thịt kho, gỏi cuốn..." className="w-full min-w-0 bg-transparent text-base text-bep-ink outline-none placeholder:text-bep-smoke" />
            </label>
            <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-bep-smoke">
              <span>Tìm nhanh:</span>
              {["món canh", "cơm nhà", "món chay"].map((tag) => <button key={tag} type="button" onClick={() => setQuery(tag)} className="min-h-11 rounded-full border border-bep-border bg-bep-surface px-3 text-bep-primary-dark hover:border-bep-primary-dark">{tag}</button>)}
            </div>
          </div>
          <div className="relative hidden min-h-[340px] items-center justify-center lg:flex" aria-hidden="true">
            <div className="absolute size-80 rounded-full bg-bep-primary-light" />
            <div className="relative flex size-64 items-center justify-center rounded-full border-[14px] border-white bg-bep-surface shadow-bep-hover"><CookingPot size={118} strokeWidth={1.25} className="text-bep-primary-dark" /></div>
            <div className="absolute bottom-4 right-4 rounded-bep-lg bg-bep-surface p-4 shadow-bep-card"><span className="text-sm font-semibold text-bep-ink">Ấm bụng, ấm lòng ♡</span></div>
          </div>
        </div>
      </section>

      <section id="cong-thuc-moi" className="mx-auto max-w-[1240px] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div><p className="mb-1 text-sm font-semibold text-bep-primary-dark">HƯƠNG VỊ MỚI</p><h2 className="text-2xl font-bold leading-8 text-bep-ink lg:text-[32px]">Công thức mới</h2></div>
          <Link href="/cong-thuc" className="hidden min-h-11 items-center gap-1 text-sm font-semibold text-bep-primary-dark sm:inline-flex">Xem tất cả <ArrowRight size={18} /></Link>
        </div>
        {shown.length ? <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">{shown.map((recipe) => <RecipeCard key={recipe.slug} recipe={recipe} />)}</div> : <div className="rounded-bep-lg border border-bep-border bg-bep-surface px-6 py-12 text-center"><ChefHat size={42} className="mx-auto text-bep-primary-dark" /><h3 className="mt-3 text-lg font-semibold">Chưa tìm thấy món phù hợp</h3><p className="mt-2 text-sm text-bep-smoke">Thử tên món hoặc nguyên liệu khác nhé.</p><button type="button" onClick={() => setQuery("")} className="mt-5 min-h-11 rounded-bep-md bg-bep-primary px-5 font-semibold text-white">Xem tất cả món</button></div>}
      </section>

      <section className="bg-bep-dim px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto grid max-w-[1200px] items-center gap-8 lg:grid-cols-2">
          <div><span className="inline-flex items-center gap-2 text-sm font-semibold text-bep-primary-dark"><Shuffle size={18} /> GỢI Ý CHO BẠN</span><h2 className="mt-3 text-[32px] font-bold leading-10 text-bep-ink">Hôm nay ăn gì?</h2><p className="mt-4 max-w-lg text-base leading-7 text-bep-smoke">Chưa biết nấu món gì cho bữa cơm hôm nay? Để bếp nhà gợi ý một món bất ngờ nhé.</p><Link href="/hom-nay-an-gi" className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-bep-md bg-bep-primary px-6 font-semibold text-white hover:bg-bep-primary-dark"><Shuffle size={18} /> Gợi ý món ngẫu nhiên</Link></div>
          <div className="rounded-bep-lg bg-bep-surface p-6 shadow-bep-card sm:p-8"><div className="mb-4 flex size-12 items-center justify-center rounded-full bg-bep-primary-light text-bep-primary-dark"><UtensilsCrossed size={24} /></div><p className="text-sm font-semibold text-bep-herb">MÓN BẾP NHÀ GỢI Ý</p><h3 className="mt-2 text-xl font-semibold text-bep-ink">Chọn món theo khẩu vị của bạn</h3><p className="mt-2 text-sm leading-6 text-bep-smoke">Lọc theo loại món, thời gian và khẩu phần rồi bốc một công thức từ gian bếp.</p><Link href="/hom-nay-an-gi" className="mt-4 inline-flex min-h-11 items-center gap-1 font-semibold text-bep-primary-dark">Bắt đầu chọn món <ArrowRight size={17} /></Link></div>
        </div>
      </section>

      <section className="mx-auto max-w-[1240px] px-4 py-12 sm:px-6 lg:px-8 lg:py-16"><div className="mb-6"><p className="mb-1 text-sm font-semibold text-bep-primary-dark">MÓN NGON QUEN THUỘC</p><h2 className="text-2xl font-bold text-bep-ink lg:text-[32px]">Được yêu thích trong bếp nhà</h2><p className="mt-2 text-sm text-bep-smoke">Gợi ý từ bộ công thức hiện có; số lượt thích sẽ cập nhật khi góc cộng đồng mở.</p></div><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{recipes.slice(0, 3).map((recipe) => <RecipeCard key={recipe.slug} recipe={recipe} compact />)}</div></section>

      <section className="bg-bep-dim/70 px-4 py-12 sm:px-6 lg:px-8 lg:py-16"><div className="mx-auto max-w-[1200px]"><div className="mb-6"><p className="mb-1 text-sm font-semibold text-bep-primary-dark">MÂM CƠM MỖI TUẦN</p><h2 className="text-2xl font-bold text-bep-ink lg:text-[32px]">{menu?.title ?? "Thực đơn tuần"}</h2><p className="mt-2 text-sm text-bep-smoke">{menu?.summary ?? "Thực đơn mới sẽ sớm có mặt."}</p></div><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{menuRecipes.map((recipe, index) => <div key={recipe.slug} className="rounded-bep-md bg-bep-surface p-4 shadow-bep-card"><span className="text-xs font-semibold text-bep-herb">MÓN {index + 1}</span><h3 className="mt-2 text-lg font-semibold text-bep-ink">{recipe.title}</h3><p className="mt-2 flex items-center gap-1 text-sm text-bep-smoke"><Clock3 size={16} /> {recipe.cookTime} phút</p><Link href={"/cong-thuc/" + recipe.slug} className="mt-3 inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-bep-primary-dark">Xem món <ArrowRight size={16} /></Link></div>)}</div></div></section>

      <section className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6 lg:px-8 lg:py-16"><div className="rounded-bep-lg bg-bep-herb-light p-6 sm:p-8 lg:flex lg:items-center lg:justify-between lg:gap-8"><div><span className="inline-flex items-center gap-2 text-sm font-semibold text-bep-herb"><CookingPot size={18} /> THỬ THÁCH TUẦN</span><h2 className="mt-3 text-2xl font-bold text-bep-ink lg:text-[32px]">{challenge?.title ?? "Cùng vào bếp tuần này"}</h2><p className="mt-3 max-w-2xl text-sm leading-6 text-bep-smoke">{challenge?.summary ?? "Thử thách mới sẽ sớm có mặt."}</p></div><span className="mt-5 inline-flex min-h-11 items-center rounded-bep-md bg-bep-surface px-5 text-sm font-semibold text-bep-herb lg:mt-0">{challenge?.weekLabel ?? "Sắp mở"}</span></div></section>
    </>
  );
}
