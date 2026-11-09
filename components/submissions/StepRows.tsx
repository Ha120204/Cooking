"use client";

import { Plus, Trash2 } from "lucide-react";

export type StepDraft = { key: string; text: string };

type Props = {
  rows: StepDraft[];
  onChange: (key: string, value: string) => void;
  onAdd: () => void;
  onRemove: (key: string) => void;
};

export function StepRows({ rows, onChange, onAdd, onRemove }: Props) {
  return <div className="space-y-3">
    {rows.map((row, index) => <div key={row.key} className="flex gap-3 rounded-bep-md bg-bep-canvas p-3">
      <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-bep-primary-light font-bold text-bep-primary-dark">{index + 1}</span>
      <label className="min-w-0 flex-1 text-sm font-medium text-bep-ink">Bước {index + 1}<textarea required minLength={10} maxLength={1000} rows={3} value={row.text} onChange={(event) => onChange(row.key, event.target.value)} placeholder="Mô tả cách làm rõ ràng để mọi người nấu theo..." className="bep-field mt-1 block w-full rounded-bep-sm border border-bep-border bg-white p-3 text-sm leading-6" /></label>
      <button type="button" onClick={() => onRemove(row.key)} disabled={rows.length === 1} aria-label={`Xóa bước ${index + 1}`} className="flex size-11 shrink-0 items-center justify-center rounded-bep-sm text-bep-error-text hover:bg-bep-dim disabled:opacity-40"><Trash2 size={19} /></button>
    </div>)}
    <button type="button" onClick={onAdd} disabled={rows.length >= 15} className="inline-flex min-h-11 items-center gap-2 rounded-bep-md bg-bep-dim px-4 text-sm font-semibold text-bep-primary-dark disabled:opacity-50"><Plus size={18} /> Thêm bước nấu</button>
  </div>;
}
