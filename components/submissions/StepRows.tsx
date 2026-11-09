"use client";

import { Plus, Trash2 } from "lucide-react";
import { FieldError } from "@/components/forms/FieldError";
import type { FieldErrors } from "@/lib/validation/form-fields";

export type StepDraft = { key: string; text: string };

type Props = {
  rows: StepDraft[];
  onChange: (key: string, value: string) => void;
  onAdd: () => void;
  onRemove: (key: string) => void;
  errors: FieldErrors;
};

export function StepRows({ rows, onChange, onAdd, onRemove, errors }: Props) {
  function addRow() {
    const nextIndex = rows.length;
    onAdd();
    window.requestAnimationFrame(() => document.querySelector<HTMLTextAreaElement>(`[data-field="steps.${nextIndex}"]`)?.focus());
  }

  function removeRow(key: string, index: number) {
    onRemove(key);
    const nextIndex = Math.min(index, rows.length - 2);
    window.requestAnimationFrame(() => document.querySelector<HTMLTextAreaElement>(`[data-field="steps.${nextIndex}"]`)?.focus());
  }

  return <div className="space-y-3">
    {rows.map((row, index) => <div key={row.key} className="flex gap-3 rounded-bep-md bg-bep-canvas p-3">
      <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-bep-primary-light font-bold text-bep-primary-dark">{index + 1}</span>
      <label className="min-w-0 flex-1 text-sm font-medium text-bep-ink">Bước {index + 1}<textarea data-field={`steps.${index}`} aria-invalid={!!(errors[`steps.${index}`] ?? (index === 0 ? errors.steps : undefined))} aria-describedby={errors[`steps.${index}`] || (index === 0 && errors.steps) ? `step-${index}-error` : undefined} required minLength={10} maxLength={1000} rows={3} value={row.text} onChange={(event) => onChange(row.key, event.target.value)} placeholder="Mô tả cách làm rõ ràng để mọi người nấu theo..." className="bep-field mt-1 block w-full rounded-bep-sm border border-bep-border bg-white p-3 text-sm leading-6" /><FieldError id={`step-${index}-error`} message={errors[`steps.${index}`] ?? (index === 0 ? errors.steps : undefined)} /></label>
      <button type="button" onClick={() => removeRow(row.key, index)} disabled={rows.length === 1} aria-label={`Xóa bước ${index + 1}`} className="bep-action bep-action-muted flex size-11 shrink-0 items-center justify-center rounded-bep-sm text-bep-error-text"><Trash2 size={19} /></button>
    </div>)}
    <button type="button" onClick={addRow} disabled={rows.length >= 15} className="bep-action bep-action-muted inline-flex min-h-11 items-center gap-2 rounded-bep-md bg-bep-dim px-4 text-sm font-semibold text-bep-primary-dark"><Plus size={18} /> Thêm bước nấu</button>
  </div>;
}
