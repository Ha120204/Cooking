"use client";

import { useEffect, useState } from "react";
import { ThumbsUp } from "lucide-react";
import { sendGAEvent } from "@next/third-parties/google";
import type { RecipeStat } from "@/lib/supabase/types";
import { announceStats } from "./RecipeStats";

export function LikeButton({ slug }: { slug: string }) {
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(0);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    const controller = new AbortController();
    fetch(`/api/recipes/${slug}/engagement`, { cache: "no-store", signal: controller.signal })
      .then((response) => response.ok ? response.json() as Promise<{ liked: boolean; stat: RecipeStat }> : null)
      .then((data) => { if (data && !controller.signal.aborted) { setLiked(data.liked); setCount(data.stat.like_count); } })
      .catch(() => {});
    return () => controller.abort();
  }, [slug]);

  async function toggle() {
    if (pending) return;
    const wasLiked = liked;
    const wasCount = count;
    setLiked(!wasLiked);
    setCount(Math.max(0, wasCount + (wasLiked ? -1 : 1)));
    setPending(true);
    setError("");
    try {
      const response = await fetch(`/api/recipes/${slug}/like`, {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ website: "" }),
      });
      const data = await response.json() as { liked?: boolean; stat?: RecipeStat; error?: string };
      if (!response.ok || !data.stat || data.liked === undefined) throw new Error(data.error ?? "Chưa cập nhật được lượt thích.");
      setLiked(data.liked);
      setCount(data.stat.like_count);
      announceStats(data.stat);
      if (data.liked) sendGAEvent("event", "like_recipe", { recipe_slug: slug });
    } catch (reason) {
      setLiked(wasLiked);
      setCount(wasCount);
      setError(reason instanceof Error ? reason.message : "Chưa cập nhật được lượt thích.");
    } finally {
      setPending(false);
    }
  }

  return <span><button type="button" onClick={toggle} disabled={pending} aria-busy={pending} aria-pressed={liked} className="bep-action bep-action-muted inline-flex min-h-11 items-center gap-2 rounded-bep-md bg-bep-dim px-4 text-sm font-semibold text-bep-primary-dark"><ThumbsUp size={18} fill={liked ? "currentColor" : "none"} /> {pending ? "Đang lưu..." : liked ? "Đã thích" : "Thích"} · {count}</button>{error && <span role="alert" className="ml-2 text-xs text-[#B42318]">{error}</span>}</span>;
}
