"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { defaultRecipeFilters, type RecipeFilters } from "@/lib/recipe-filters";
import { RecipeFilterControls } from "./RecipeFilterControls";

type Props = { open: boolean; filters: RecipeFilters; onClose: () => void; onApply: (filters: RecipeFilters) => void };

export function MobileFilterSheet({ open, filters, onClose, onApply }: Props) {
  const [draft, setDraft] = useState(filters);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;
  return <div className="fixed inset-0 z-[70] lg:hidden" role="presentation">
    <button type="button" aria-label="Đóng bộ lọc" onClick={onClose} className="absolute inset-0 w-full bg-bep-ink/50" />
    <section role="dialog" aria-modal="true" aria-labelledby="filter-sheet-title" className="absolute inset-x-0 bottom-0 flex max-h-[88dvh] flex-col rounded-t-[24px] bg-bep-surface pb-[env(safe-area-inset-bottom)] shadow-bep-hover">
      <div className="mx-auto mt-3 h-1.5 w-12 rounded-full bg-bep-border-hover" />
      <div className="flex items-center justify-between border-b border-bep-border px-5 py-3"><h2 id="filter-sheet-title" className="text-xl font-semibold">Lọc công thức</h2><button type="button" aria-label="Đóng" onClick={onClose} className="flex size-11 items-center justify-center rounded-full text-bep-primary-dark"><X size={22} /></button></div>
      <div className="overflow-y-auto px-5 py-5"><RecipeFilterControls filters={draft} onChange={(patch) => setDraft((current) => ({ ...current, ...patch }))} /></div>
      <div className="flex gap-3 border-t border-bep-border bg-bep-surface px-5 py-4"><button type="button" onClick={() => setDraft({ ...defaultRecipeFilters, q: draft.q, favoritesOnly: draft.favoritesOnly, sort: draft.sort })} className="min-h-11 flex-1 rounded-bep-md border border-bep-border font-semibold text-bep-primary-dark">Đặt lại</button><button type="button" onClick={() => onApply(draft)} className="min-h-11 flex-1 rounded-bep-md bg-bep-primary font-semibold text-white">Xem kết quả</button></div>
    </section>
  </div>;
}
