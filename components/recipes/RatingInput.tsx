"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { sendGAEvent } from "@next/third-parties/google";
import type { RecipeStat } from "@/lib/supabase/types";
import { announceStats } from "./RecipeStats";

export function RatingInput({ slug }: { slug: string }) {
  const [rating, setRating] = useState<number | null>(null);
  const [stat, setStat] = useState<RecipeStat | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    const controller = new AbortController();
    fetch(`/api/recipes/${slug}/engagement`, { cache: "no-store", signal: controller.signal })
      .then((response) => response.ok ? response.json() as Promise<{ my_rating: number | null; stat: RecipeStat }> : null)
      .then((data) => { if (data && !controller.signal.aborted) { setRating(data.my_rating); setStat(data.stat); } })
      .catch(() => {});
    return () => controller.abort();
  }, [slug]);

  async function rate(stars: number) {
    if (pending) return;
    const previousRating = rating;
    const previousStat = stat;
    setRating(stars);
    setPending(true);
    setError("");
    if (stat) {
      const nextCount = stat.rating_count + (previousRating === null ? 1 : 0);
      const total = (stat.avg_rating ?? 0) * stat.rating_count - (previousRating ?? 0) + stars;
      const optimistic = { ...stat, rating_count: nextCount, avg_rating: Math.round(total / nextCount * 10) / 10 };
      setStat(optimistic);
      announceStats(optimistic);
    }
    try {
      const response = await fetch(`/api/recipes/${slug}/rating`, {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ stars, website: "" }),
      });
      const data = await response.json() as { my_rating?: number; stat?: RecipeStat; error?: string };
      if (!response.ok || !data.stat) throw new Error(data.error ?? "Chưa cập nhật được đánh giá.");
      setRating(data.my_rating ?? stars);
      setStat(data.stat);
      announceStats(data.stat);
      sendGAEvent("event", "rate_recipe", { recipe_slug: slug, stars });
    } catch (reason) {
      setRating(previousRating);
      setStat(previousStat);
      if (previousStat) announceStats(previousStat);
      setError(reason instanceof Error ? reason.message : "Chưa cập nhật được đánh giá.");
    } finally {
      setPending(false);
    }
  }

  return <div className="rounded-bep-md bg-bep-dim/70 px-4 py-3"><div className="flex flex-wrap items-center gap-3"><span className="text-sm font-medium text-bep-smoke">Chạm để đánh giá:</span><div className="flex" role="group" aria-label="Chấm sao cho công thức">{[1, 2, 3, 4, 5].map((star) => <button key={star} type="button" onClick={() => rate(star)} disabled={pending} aria-label={`${star} sao`} aria-pressed={rating === star} className="flex size-11 items-center justify-center text-bep-star disabled:opacity-60"><Star size={22} fill={rating !== null && star <= rating ? "currentColor" : "none"} /></button>)}</div>{rating !== null && <span className="text-xs text-bep-smoke">Bạn đã chấm {rating} sao</span>}</div>{error && <p role="alert" className="mt-2 text-xs text-[#B42318]">{error}</p>}</div>;
}
