"use client";

import { Heart, Lightbulb } from "lucide-react";
import { categories, difficulties, timeOptions, type RecipeFilters } from "@/lib/recipe-filters";
import { categoryLabel, difficultyLabel } from "@/lib/recipe-schema";

type Props = {
  filters: RecipeFilters;
  onChange: (patch: Partial<RecipeFilters>) => void;
  showFavorites?: boolean;
  showTip?: boolean;
};

const timeLabel: Record<(typeof timeOptions)[number], string> = {
  "15": "≤ 15 phút",
  "30": "≤ 30 phút",
  "60": "≤ 60 phút",
  "over-60": "Trên 60 phút",
};

export function RecipeFilterControls({ filters, onChange, showFavorites = false, showTip = false }: Props) {
  return <div className="space-y-6">
    {showFavorites && <button type="button" aria-pressed={filters.favoritesOnly} onClick={() => onChange({ favoritesOnly: !filters.favoritesOnly })} className="flex min-h-11 w-full items-center justify-between rounded-bep-md bg-bep-primary-light px-4 text-sm font-semibold text-bep-primary-dark"><span className="flex items-center gap-2"><Heart size={18} fill={filters.favoritesOnly ? "currentColor" : "none"} /> Chỉ món đã lưu</span><span aria-hidden="true" className={"relative h-6 w-11 rounded-full transition " + (filters.favoritesOnly ? "bg-bep-primary" : "bg-bep-border-hover")}><span className={"absolute top-1 size-4 rounded-full bg-white transition-all " + (filters.favoritesOnly ? "left-6" : "left-1")} /></span></button>}
    <fieldset><legend className="mb-3 text-sm font-bold text-bep-ink">Loại món</legend><div className="space-y-1">{[[null, "Tất cả món"], ...categories.map((value) => [value, categoryLabel[value]])].map(([value, label]) => <button key={value ?? "all"} type="button" aria-pressed={filters.category === value} onClick={() => onChange({ category: value as RecipeFilters["category"] })} className={"flex min-h-11 w-full items-center rounded-bep-md px-3 text-left text-sm transition " + (filters.category === value ? "bg-bep-primary-light font-semibold text-bep-primary-dark" : "text-bep-smoke hover:bg-bep-dim")}>{label}</button>)}</div></fieldset>
    <fieldset><legend className="mb-3 text-sm font-bold text-bep-ink">Độ khó</legend><div className="space-y-1">{difficulties.map((value) => <button key={value} type="button" aria-pressed={filters.difficulty === value} onClick={() => onChange({ difficulty: filters.difficulty === value ? null : value })} className={"flex min-h-11 w-full items-center rounded-bep-md px-3 text-left text-sm transition " + (filters.difficulty === value ? "bg-bep-herb-light font-semibold text-bep-herb" : "text-bep-smoke hover:bg-bep-dim")}>{difficultyLabel[value]}</button>)}</div></fieldset>
    <fieldset><legend className="mb-3 text-sm font-bold text-bep-ink">Thời gian nấu</legend><div className="space-y-1">{timeOptions.map((value) => <button key={value} type="button" aria-pressed={filters.time === value} onClick={() => onChange({ time: filters.time === value ? null : value })} className={"flex min-h-11 w-full items-center rounded-bep-md px-3 text-left text-sm transition " + (filters.time === value ? "bg-bep-primary-light font-semibold text-bep-primary-dark" : "text-bep-smoke hover:bg-bep-dim")}>{timeLabel[value]}</button>)}</div></fieldset>
    {showTip && <div className="rounded-bep-md bg-bep-herb-light p-4 text-sm leading-6 text-bep-smoke"><p className="flex items-center gap-2 font-semibold text-bep-herb"><Lightbulb size={18} /> Mẹo nhỏ gian bếp</p><p className="mt-1">Chọn thời gian phù hợp để tìm món ngon cho bữa cơm hôm nay.</p></div>}
  </div>;
}

export { timeLabel };
