"use client";

import { useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { sendGAEvent } from "@next/third-parties/google";
import { Send } from "lucide-react";
import { questionCategoryLabels, type PublicQuestion, type QuestionCategory } from "@/lib/supabase/types";
import { questionSchema } from "@/lib/validation/forum";
import { FieldError } from "@/components/forms/FieldError";
import { fieldErrorsFromZod, focusFirstError, type FieldErrors } from "@/lib/validation/form-fields";

export function QuestionForm({ idPrefix = "question" }: { idPrefix?: string }) {
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState<QuestionCategory>("meo-vat");
  const [website, setWebsite] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  function clearField(field: string) { setFieldErrors((current) => ({ ...current, [field]: "" })); }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    setError("");
    setFieldErrors({});
    const payload = questionSchema.safeParse({ display_name: name, title, body, category, website });
    if (!payload.success) {
      const errors = fieldErrorsFromZod(payload.error, {
        display_name: "Tên hiển thị cần từ 2 đến 60 ký tự.",
        title: "Tiêu đề cần từ 5 đến 150 ký tự.",
        body: "Nội dung câu hỏi cần từ 10 đến 3000 ký tự.",
        category: "Vui lòng chọn chủ đề.",
      });
      setFieldErrors(errors);
      focusFirstError(formRef.current, errors);
      return;
    }
    setPending(true);
    try {
      const response = await fetch("/api/questions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload.data) });
      const data = await response.json() as { question?: PublicQuestion; error?: string };
      if (!response.ok || !data.question) throw new Error(data.error ?? "Chưa gửi được câu hỏi.");
      sendGAEvent("event", "ask_question", { question_category: category });
      router.push(`/hoi-bep/${data.question.id}`);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Chưa gửi được câu hỏi.");
      setPending(false);
    }
  }

  const inputClass = "bep-field mt-1 block min-h-12 w-full rounded-bep-md border border-bep-border bg-bep-canvas px-4 text-sm";
  return <div className="relative overflow-hidden rounded-bep-lg border border-bep-border bg-bep-surface p-5 shadow-bep-card sm:p-7"><div className="absolute inset-x-0 top-0 h-1.5 bg-bep-primary" /><h2 className="mt-2 text-xl font-semibold">Bạn đang gặp khó ở khâu nào?</h2><p className="mt-2 text-sm leading-6 text-bep-smoke">Hỏi thật lòng, chỉ bảo tận tình. Ai vào bếp cũng từng một lần bỡ ngỡ.</p><form ref={formRef} noValidate onSubmit={submit} className="mt-5 grid gap-4">
    <label className="text-sm font-semibold">Tên hiển thị người hỏi *<input data-field="display_name" aria-invalid={!!fieldErrors.display_name} aria-describedby={fieldErrors.display_name ? `${idPrefix}-name-error` : undefined} required minLength={2} maxLength={60} value={name} onChange={(event) => { setName(event.target.value); clearField("display_name"); }} placeholder="VD: Bé Mai, Bạn Bếp Nhỏ" className={inputClass} /><FieldError id={`${idPrefix}-name-error`} message={fieldErrors.display_name} /></label>
    <label className="text-sm font-semibold">Tiêu đề câu hỏi ngắn gọn *<input data-field="title" aria-invalid={!!fieldErrors.title} aria-describedby={fieldErrors.title ? `${idPrefix}-title-error` : undefined} required minLength={5} maxLength={150} value={title} onChange={(event) => { setTitle(event.target.value); clearField("title"); }} placeholder="VD: Làm sao để cá kho không bị tanh?" className={inputClass} /><FieldError id={`${idPrefix}-title-error`} message={fieldErrors.title} /></label>
    <label className="text-sm font-semibold">Kể chi tiết điều bạn muốn hỏi *<textarea data-field="body" aria-invalid={!!fieldErrors.body} aria-describedby={fieldErrors.body ? `${idPrefix}-body-error` : undefined} required minLength={10} maxLength={3000} rows={4} value={body} onChange={(event) => { setBody(event.target.value); clearField("body"); }} placeholder="Nguyên liệu, cách bạn đã thử và vấn đề đang gặp..." className="bep-field mt-1 block w-full rounded-bep-md border border-bep-border bg-bep-canvas p-4 text-sm leading-6" /><FieldError id={`${idPrefix}-body-error`} message={fieldErrors.body} /></label>
    <fieldset><legend className="mb-2 text-sm font-semibold">Thuộc chủ đề nào?</legend><div className="flex flex-wrap gap-2">{(Object.keys(questionCategoryLabels) as QuestionCategory[]).map((item) => <button key={item} type="button" onClick={() => setCategory(item)} aria-pressed={category === item} className={`bep-chip min-h-11 rounded-bep-md border px-3 text-xs font-semibold ${category === item ? "border-bep-herb bg-bep-herb-light text-bep-herb-ink" : "border-bep-border bg-bep-canvas text-bep-smoke"}`}>{questionCategoryLabels[item]}</button>)}</div></fieldset>
    <div className="absolute -left-[10000px]" aria-hidden="true"><label htmlFor={`${idPrefix}-website`}>Website</label><input id={`${idPrefix}-website`} tabIndex={-1} autoComplete="off" value={website} onChange={(event) => setWebsite(event.target.value)} /></div>
    {error && <p role="alert" className="text-sm text-bep-error-text">{error}</p>}
    <button type="submit" disabled={pending} aria-busy={pending} className="bep-action bep-action-primary inline-flex min-h-12 items-center justify-center gap-2 rounded-bep-md bg-bep-primary px-5 font-semibold text-white"><Send size={18} /> {pending ? "Đang gửi..." : "Gửi câu hỏi lên Bếp"}</button><p className="text-xs leading-5 text-bep-smoke">Câu hỏi sẽ hiển thị ngay để mọi người cùng chia sẻ.</p>
  </form></div>;
}
