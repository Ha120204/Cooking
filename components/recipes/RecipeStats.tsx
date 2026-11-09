"use client";

import { useEffect, useState } from "react";
import { RatingStars } from "./RatingStars";
import type { RecipeStat } from "@/lib/supabase/types";

export const statsEvent = "bep:recipe-stats";

export function announceStats(stat: RecipeStat) {
  window.dispatchEvent(new CustomEvent<RecipeStat>(statsEvent, { detail: stat }));
}

export function RecipeStats({ slug, showLikes = false }: { slug: string; showLikes?: boolean }) {
  const [stat, setStat] = useState<RecipeStat | null>(null);
  const [failed, setFailed] = useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const controller = new AbortController();
    const onStats = (event: Event) => {
      const next = (event as CustomEvent<RecipeStat>).detail;
      if (next.recipe_slug === slug) { setStat(next); setLoading(false); setFailed(false); }
    };
    window.addEventListener(statsEvent, onStats);
    fetch(`/api/recipes/stats?slugs=${encodeURIComponent(slug)}`, { cache: "no-store", signal: controller.signal })
      .then((response) => { if (!response.ok) throw new Error("stats unavailable"); return response.json() as Promise<{ stats: RecipeStat[] }>; })
      .then((result) => { if (!controller.signal.aborted) { setStat(result.stats[0] ?? null); setFailed(false); setLoading(false); } })
      .catch(() => { if (!controller.signal.aborted) { setFailed(true); setLoading(false); } });
    return () => { controller.abort(); window.removeEventListener(statsEvent, onStats); };
  }, [slug]);
  return <span className="inline-flex flex-wrap items-center gap-2">{loading && !stat ? <span role="status" aria-label="Đang tải đánh giá" className="inline-block h-4 w-28 animate-pulse rounded-bep-sm bg-bep-dim" /> : failed && !stat ? <span className="text-xs text-bep-smoke">Chưa tải được đánh giá</span> : <RatingStars average={stat?.avg_rating} count={stat?.rating_count} />}{showLikes && stat && <span className="text-xs text-bep-smoke">{stat.like_count} lượt thích</span>}</span>;
}
