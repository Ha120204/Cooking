"use client";

import { Plus, Trash2 } from "lucide-react";

export type IngredientDraft = { key: string; name: string; amount: string; unit: string };

type Props = {
  rows: IngredientDraft[];
  onChange: (key: string, field: "name" | "amount" | "unit", value: string) => void;
  onAdd: () => void;
  onRemove: (key: string) => void;
};

export function IngredientRows({ rows, onChange, onAdd, onRemove }: Props) {
  return <div className="space-y-3">
    {rows.map((row, index) => <div key={row.key} className="grid gap-2 rounded-bep-md bg-bep-canvas p-3 sm:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)_44px] sm:items-end">
      <label className="text-sm font-medium text-bep-ink">Nguyên liệu {index + 1}<input required minLength={2} maxLength={100} value={row.name} onChange={(event) => onChange(row.key, "name", event.target.value)} placeholder="Tên nguyên liệu" className="mt-1 block min-h-11 w-full rounded-bep-sm border border-bep-border bg-white px-3" /></label>
      <label className="text-sm font-medium text-bep-ink">Số lượng<input required maxLength={30} value={row.amount} onChange={(event) => onChange(row.key, "amount", event.target.value)} placeholder="VD: 2" className="mt-1 block min-h-11 w-full rounded-bep-sm border border-bep-border bg-white px-3" /></label>
      <label className="text-sm font-medium text-bep-ink">Đơn vị<input maxLength={30} value={row.unit} onChange={(event) => onChange(row.key, "unit", event.target.value)} placeholder="VD: miếng" className="mt-1 block min-h-11 w-full rounded-bep-sm border border-bep-border bg-white px-3" /></label>
      <button type="button" onClick={() => onRemove(row.key)} disabled={rows.length === 1} aria-label={`Xóa nguyên liệu ${index + 1}`} className="flex size-11 items-center justify-center rounded-bep-sm text-bep-error-text hover:bg-bep-dim disabled:opacity-40"><Trash2 size={19} /></button>
    </div>)}
    <button type="button" onClick={onAdd} disabled={rows.length >= 30} className="inline-flex min-h-11 items-center gap-2 rounded-bep-md bg-bep-dim px-4 text-sm font-semibold text-bep-primary-dark disabled:opacity-50"><Plus size={18} /> Thêm nguyên liệu</button>
  </div>;
}
