"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { defaultRecipeFilters, type RecipeFilters } from "@/lib/recipe-filters";
import { RecipeFilterControls } from "./RecipeFilterControls";

type Props = { open: boolean; filters: RecipeFilters; onClose: () => void; onApply: (filters: RecipeFilters) => void };

export function MobileFilterSheet({ open, filters, onClose, onApply }: Props) {
  const [draft, setDraft] = useState(filters);
  const dialogRef = useRef<HTMLElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => { if (open) setDraft(filters); }, [open, filters]);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") { event.preventDefault(); onClose(); return; }
      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])',
      ));
      if (!focusable.length) { event.preventDefault(); return; }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      else if (!dialogRef.current.contains(document.activeElement)) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => { document.removeEventListener("keydown", onKeyDown); document.body.style.overflow = previousOverflow; };
  }, [open, onClose]);

  if (!open) return null;
  return <div className="fixed inset-0 z-[70] lg:hidden" role="presentation">
    <div aria-hidden="true" onClick={onClose} className="absolute inset-0 bg-bep-ink/50" />
    <section ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="filter-sheet-title" className="absolute inset-x-0 bottom-0 flex max-h-[88dvh] flex-col rounded-t-[24px] bg-bep-surface pb-[env(safe-area-inset-bottom)] shadow-bep-hover">
      <div className="mx-auto mt-3 h-1.5 w-12 rounded-full bg-bep-border-hover" />
      <div className="flex items-center justify-between border-b border-bep-border px-5 py-3"><h2 id="filter-sheet-title" className="text-xl font-semibold">Lọc công thức</h2><button ref={closeRef} type="button" aria-label="Đóng" onClick={onClose} className="bep-action bep-action-muted flex size-11 items-center justify-center rounded-full text-bep-primary-dark"><X size={22} /></button></div>
      <div className="overflow-y-auto px-5 py-5"><RecipeFilterControls filters={draft} onChange={(patch) => setDraft((current) => ({ ...current, ...patch }))} /></div>
      <div className="flex gap-3 border-t border-bep-border bg-bep-surface px-5 py-4"><button type="button" onClick={() => setDraft({ ...defaultRecipeFilters, q: draft.q, favoritesOnly: draft.favoritesOnly, sort: draft.sort })} className="bep-action bep-action-outline min-h-11 flex-1 rounded-bep-md border border-bep-border font-semibold text-bep-primary-dark">Đặt lại</button><button type="button" onClick={() => onApply(draft)} className="bep-action bep-action-primary min-h-11 flex-1 rounded-bep-md bg-bep-primary font-semibold text-white">Xem kết quả</button></div>
    </section>
  </div>;
}
