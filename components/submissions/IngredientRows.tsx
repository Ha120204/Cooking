"use client";

import { Plus, Trash2 } from "lucide-react";
import { FieldError } from "@/components/forms/FieldError";
import type { FieldErrors } from "@/lib/validation/form-fields";

export type IngredientDraft = { key: string; name: string; amount: string; unit: string };

type Props = {
  rows: IngredientDraft[];
  onChange: (key: string, field: "name" | "amount" | "unit", value: string) => void;
  onAdd: () => void;
  onRemove: (key: string) => void;
  errors: FieldErrors;
};

export function IngredientRows({ rows, onChange, onAdd, onRemove, errors }: Props) {
  function addRow() {
    const nextIndex = rows.length;
    onAdd();
    window.requestAnimationFrame(() => document.querySelector<HTMLInputElement>(`[data-field="ingredients.${nextIndex}.name"]`)?.focus());
  }

  function removeRow(key: string, index: number) {
    onRemove(key);
    const nextIndex = Math.min(index, rows.length - 2);
    window.requestAnimationFrame(() => document.querySelector<HTMLInputElement>(`[data-field="ingredients.${nextIndex}.name"]`)?.focus());
  }

  return <div className="space-y-3">
    {rows.map((row, index) => <div key={row.key} className="grid gap-2 rounded-bep-md bg-bep-canvas p-3 sm:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)_44px] sm:items-end">
      <label className="text-sm font-medium text-bep-ink">Nguyên liệu {index + 1}<input data-field={`ingredients.${index}.name`} aria-invalid={!!errors[`ingredients.${index}.name`]} aria-describedby={errors[`ingredients.${index}.name`] ? `ingredient-${index}-name-error` : undefined} required minLength={2} maxLength={100} value={row.name} onChange={(event) => onChange(row.key, "name", event.target.value)} placeholder="Tên nguyên liệu" className="bep-field mt-1 block min-h-11 w-full rounded-bep-sm border border-bep-border bg-white px-3" /><FieldError id={`ingredient-${index}-name-error`} message={errors[`ingredients.${index}.name`]} /></label>
      <label className="text-sm font-medium text-bep-ink">Số lượng<input data-field={`ingredients.${index}.amount`} aria-invalid={!!errors[`ingredients.${index}.amount`]} aria-describedby={errors[`ingredients.${index}.amount`] ? `ingredient-${index}-amount-error` : undefined} required maxLength={30} value={row.amount} onChange={(event) => onChange(row.key, "amount", event.target.value)} placeholder="VD: 2" className="bep-field mt-1 block min-h-11 w-full rounded-bep-sm border border-bep-border bg-white px-3" /><FieldError id={`ingredient-${index}-amount-error`} message={errors[`ingredients.${index}.amount`]} /></label>
      <label className="text-sm font-medium text-bep-ink">Đơn vị<input data-field={`ingredients.${index}.unit`} aria-invalid={!!errors[`ingredients.${index}.unit`]} aria-describedby={errors[`ingredients.${index}.unit`] ? `ingredient-${index}-unit-error` : undefined} maxLength={30} value={row.unit} onChange={(event) => onChange(row.key, "unit", event.target.value)} placeholder="VD: miếng" className="bep-field mt-1 block min-h-11 w-full rounded-bep-sm border border-bep-border bg-white px-3" /><FieldError id={`ingredient-${index}-unit-error`} message={errors[`ingredients.${index}.unit`]} /></label>
      <button type="button" onClick={() => removeRow(row.key, index)} disabled={rows.length === 1} aria-label={`Xóa nguyên liệu ${index + 1}`} className="bep-action bep-action-muted flex size-11 items-center justify-center rounded-bep-sm text-bep-error-text"><Trash2 size={19} /></button>
    </div>)}
    <button type="button" onClick={addRow} disabled={rows.length >= 30} className="bep-action bep-action-muted inline-flex min-h-11 items-center gap-2 rounded-bep-md bg-bep-dim px-4 text-sm font-semibold text-bep-primary-dark"><Plus size={18} /> Thêm nguyên liệu</button>
  </div>;
}
