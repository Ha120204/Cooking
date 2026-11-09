import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Clock3, CookingPot, Heart, Lightbulb, MessageCircle, Share2, Users } from "lucide-react";
import type { Recipe, RecipeFrontmatter } from "@/lib/recipe-schema";
import { categoryLabel, difficultyLabel } from "@/lib/recipe-schema";
import { Header } from "@/components/layout/Header";
import { MobileNav } from "@/components/layout/MobileNav";
import { Footer } from "@/components/layout/Footer";
import { FavoriteButton } from "./FavoriteButton";
import { RecipeStats } from "./RecipeStats";
import { LikeButton } from "./LikeButton";
import { RatingInput } from "./RatingInput";
import { CommentSection } from "@/components/community/CommentSection";
import { RecipeCard } from "./RecipeCard";

type RecipeDetailProps = { recipe: Recipe; body: ReactNode; related: RecipeFrontmatter[] };

function Ingredients({ recipe }: { recipe: Recipe }) {
  return <aside className="rounded-bep-lg border border-bep-border bg-bep-surface p-5 shadow-bep-card lg:sticky lg:top-24 lg:p-6">
    <div className="mb-4 flex items-center justify-between gap-3"><h2 className="text-xl font-semibold text-bep-ink">Nguyên liệu chuẩn bị</h2><span className="rounded-full bg-bep-herb-light px-2.5 py-1 text-xs font-semibold text-bep-herb-ink">{recipe.servings} người</span></div>
    <ul className="divide-y divide-bep-border">{recipe.ingredients.map((ingredient, index) => <li key={index} className="flex items-start justify-between gap-3 py-3 text-sm leading-6"><span className="flex items-start gap-3 text-bep-ink"><span className="mt-1 flex size-5 shrink-0 items-center justify-center rounded border border-bep-border text-[10px] text-bep-smoke">✓</span>{ingredient.name}</span><span className="shrink-0 font-semibold text-bep-smoke">{ingredient.amount} {ingredient.unit}</span></li>)}</ul>
    <div className="mt-5 rounded-bep-md bg-bep-herb-light p-4"><p className="flex items-center gap-2 font-semibold text-bep-herb-ink"><Lightbulb size={18} /> Mẹo chuẩn bị</p><p className="mt-1 text-sm leading-6 text-bep-smoke">Sơ chế nguyên liệu trước khi nấu để món ăn trọn vị và tiết kiệm thời gian.</p></div>
  </aside>;
}

export function RecipeDetail({ recipe, body, related }: RecipeDetailProps) {
  return <>
    <Header active="recipe" />
    <main className="pt-16 lg:pt-20">
      <div className="mx-auto max-w-[1200px] px-4 pb-16 sm:px-6 lg:px-8">
        <nav aria-label="Đường dẫn" className="flex min-h-14 items-center gap-2 text-sm text-bep-smoke"><Link href="/" className="text-bep-primary-dark hover:underline">Trang chủ</Link><span>/</span><span>Công thức</span><span>/</span><span className="truncate text-bep-ink">{recipe.title}</span></nav>
        <Link href="/cong-thuc" className="mb-4 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-bep-primary-dark"><ArrowLeft size={18} /> Quay lại danh sách công thức</Link>

        <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
          <div className="lg:hidden"><div className="mb-3 flex flex-wrap gap-2"><span className="rounded-full bg-bep-herb-light px-3 py-1 text-xs font-semibold text-bep-herb-ink">{categoryLabel[recipe.category]}</span>{recipe.tags.slice(0, 1).map((tag) => <span key={tag} className="rounded-full bg-bep-primary-light px-3 py-1 text-xs font-semibold text-bep-primary-dark">{tag}</span>)}</div><h1 className="text-[26px] font-bold leading-[1.3] tracking-tight text-bep-ink">{recipe.title}</h1></div>
          <div className="relative aspect-[16/9] overflow-hidden rounded-bep-lg bg-bep-dim shadow-bep-card lg:aspect-[4/3]"><Image src={recipe.cover} alt={"Ảnh minh họa " + recipe.title} fill priority sizes="(max-width: 1024px) 100vw, 55vw" className="object-cover" /></div>
          <div className="flex flex-col justify-center">
            <div className="mb-3 hidden flex-wrap gap-2 lg:flex"><span className="rounded-full bg-bep-herb-light px-3 py-1 text-xs font-semibold text-bep-herb-ink">{categoryLabel[recipe.category]}</span>{recipe.tags.slice(0, 1).map((tag) => <span key={tag} className="rounded-full bg-bep-primary-light px-3 py-1 text-xs font-semibold text-bep-primary-dark">{tag}</span>)}</div>
            <h1 className="hidden text-[32px] font-bold leading-[1.3] tracking-tight text-bep-ink lg:block">{recipe.title}</h1>
            <p className="mt-4 text-base leading-[1.65] text-bep-smoke">{recipe.description}</p>
            <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-bep-md bg-bep-dim p-3"><Clock3 size={19} className="text-bep-primary-dark" /><p className="mt-1 text-xs text-bep-smoke">Thời gian</p><p className="text-sm font-semibold">{recipe.cookTime} phút</p></div>
              <div className="rounded-bep-md bg-bep-dim p-3"><Users size={19} className="text-bep-primary-dark" /><p className="mt-1 text-xs text-bep-smoke">Khẩu phần</p><p className="text-sm font-semibold">{recipe.servings} người</p></div>
              <div className="rounded-bep-md bg-bep-dim p-3"><CookingPot size={19} className="text-bep-herb-ink" /><p className="mt-1 text-xs text-bep-smoke">Độ khó</p><p className="text-sm font-semibold">{difficultyLabel[recipe.difficulty]}</p></div>
              <div className="rounded-bep-md bg-bep-dim p-3"><Heart size={19} className="text-bep-primary-dark" /><p className="mt-1 text-xs text-bep-smoke">Đánh giá</p><RecipeStats slug={recipe.slug} /></div>
            </div>
            <div className="mt-5 flex flex-wrap gap-2"><FavoriteButton slug={recipe.slug} title={recipe.title} /><LikeButton slug={recipe.slug} /><button type="button" disabled title="Chia sẻ sẽ mở sau" className="inline-flex min-h-11 cursor-not-allowed items-center gap-2 rounded-bep-md bg-bep-dim px-4 text-sm font-semibold text-bep-smoke opacity-75"><Share2 size={18} /> Chia sẻ</button></div>
            <div className="mt-4"><RatingInput slug={recipe.slug} /></div>
            <div className="mt-4 flex flex-wrap gap-1.5">{recipe.tags.map((tag) => <span key={tag} className="rounded-bep-sm bg-bep-primary-light px-2.5 py-1 text-xs font-medium text-bep-primary-dark">#{tag.replaceAll(" ", "")}</span>)}</div>
          </div>
        </section>

        <div className="mt-10 lg:grid lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)] lg:items-start lg:gap-8">
          <div className="lg:hidden"><Ingredients recipe={recipe} /></div>
          <div className="mt-8 lg:mt-0"><section className="rounded-bep-lg bg-bep-surface p-5 shadow-bep-card sm:p-7"><div className="recipe-prose">{body}</div></section>
            <section className="mt-8 rounded-bep-lg bg-bep-surface p-5 shadow-bep-card sm:p-7"><h2 className="flex items-center gap-2 text-xl font-semibold"><MessageCircle size={22} className="text-bep-primary-dark" /> Bình luận &amp; chia sẻ</h2><CommentSection targetType="recipe" slug={recipe.slug} /></section>
          </div>
          <div className="hidden lg:block"><Ingredients recipe={recipe} /></div>
        </div>

        {related.length > 0 && <section className="mt-12"><h2 className="mb-6 text-2xl font-bold text-bep-ink lg:text-[32px]">Có thể bạn cũng thích</h2><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{related.map((item) => <RecipeCard key={item.slug} recipe={item} />)}</div></section>}
      </div>
    </main>
    <Footer />
    <MobileNav active="recipe" />
  </>;
}
