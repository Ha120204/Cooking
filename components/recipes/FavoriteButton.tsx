"use client";

import { Heart } from "lucide-react";
import { toggleFavorite, useFavorites } from "@/lib/favorites";

type FavoriteButtonProps = {
  slug: string;
  title: string;
  compact?: boolean;
};

export function FavoriteButton({ slug, title, compact = false }: FavoriteButtonProps) {
  const saved = useFavorites().includes(slug);

  return (
    <button
      type="button"
      onClick={() => toggleFavorite(slug)}
      aria-pressed={saved}
      aria-label={compact ? (saved ? "Bỏ lưu " : "Lưu ") + title + " vào yêu thích" : undefined}
      className={compact
        ? "flex size-11 items-center justify-center rounded-full bg-white/95 text-bep-primary-dark shadow-bep-card transition hover:scale-105"
        : "inline-flex min-h-11 items-center justify-center gap-2 rounded-bep-md bg-bep-dim px-4 text-sm font-semibold text-bep-primary-dark transition hover:bg-bep-primary-light"}
    >
      <Heart size={21} fill={saved ? "currentColor" : "none"} />
      {!compact && <span>{saved ? "Đã lưu" : "Lưu vào yêu thích"}</span>}
    </button>
  );
}
