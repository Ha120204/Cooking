import Image from "next/image";
import Link from "next/link";
import { Clock3, CookingPot } from "lucide-react";
import type { RecipeFrontmatter } from "@/lib/recipe-schema";
import { difficultyLabel } from "@/lib/recipe-schema";
import { FavoriteButton } from "./FavoriteButton";
import { RecipeStats } from "./RecipeStats";

type RecipeCardProps = { recipe: RecipeFrontmatter; compact?: boolean; eagerImage?: boolean };

export function RecipeCard({ recipe, compact = false, eagerImage = false }: RecipeCardProps) {
  return (
    <article className={"bep-recipe-card group overflow-hidden rounded-bep-md bg-bep-surface shadow-bep-card hover:shadow-bep-hover " + (compact ? "flex items-center" : "flex flex-col")}>
      <div className={"relative shrink-0 overflow-hidden bg-bep-dim " + (compact ? "h-28 w-28 sm:h-32 sm:w-36" : "aspect-[4/3] w-full")}>
        <Link href={"/cong-thuc/" + recipe.slug} aria-label={"Xem công thức " + recipe.title} className="block size-full">
          <Image
            src={recipe.cover}
            alt={"Ảnh minh họa " + recipe.title}
            fill
            loading={eagerImage ? "eager" : "lazy"}
            fetchPriority={eagerImage ? "high" : undefined}
            sizes={compact ? "144px" : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"}
            className="object-cover transition-transform group-hover:scale-105"
          />
        </Link>
        {!compact && <div className="absolute right-3 top-3"><FavoriteButton slug={recipe.slug} title={recipe.title} compact /></div>}
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-2 p-4">
        <Link href={"/cong-thuc/" + recipe.slug} className="bep-motion inline-flex min-h-11 items-center text-lg font-semibold leading-[1.4] text-bep-ink transition-colors hover:text-bep-primary-dark">
          {recipe.title}
        </Link>
        {!compact && <p className="line-clamp-2 text-sm leading-[1.5] text-bep-smoke">{recipe.description}</p>}
        <div className="mt-auto flex flex-wrap items-center gap-2 pt-1">
          <span className="inline-flex items-center gap-1 rounded-bep-sm bg-bep-dim px-2.5 py-1 text-xs font-medium text-bep-smoke">
            <Clock3 size={14} /> {recipe.cookTime} phút
          </span>
          <span className="inline-flex items-center gap-1 rounded-bep-sm bg-bep-herb-light px-2.5 py-1 text-xs font-medium text-bep-herb-ink">
            <CookingPot size={14} /> {difficultyLabel[recipe.difficulty]}
          </span>
        </div>
        <RecipeStats slug={recipe.slug} showLikes={compact} />
      </div>
    </article>
  );
}
