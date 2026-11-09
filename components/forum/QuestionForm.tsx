"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { sendGAEvent } from "@next/third-parties/google";
import { Send } from "lucide-react";
import { questionCategoryLabels, type PublicQuestion, type QuestionCategory } from "@/lib/supabase/types";
import { questionSchema } from "@/lib/validation/forum";

export function QuestionForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState<QuestionCategory>("meo-vat");
  const [website, setWebsite] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    setError("");
    const payload = questionSchema.safeParse({ display_name: name, title, body, category, website });
    if (!payload.success) { setError("Vui lòng điền tên, tiêu đề và nội dung câu hỏi rõ ràng."); return; }
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

  const inputClass = "mt-1 block min-h-12 w-full rounded-bep-md border border-bep-border bg-bep-canvas px-4 text-sm";
  return <div className="relative overflow-hidden rounded-bep-lg border border-bep-border bg-bep-surface p-5 shadow-bep-card sm:p-7"><div className="absolute inset-x-0 top-0 h-1.5 bg-bep-primary" /><h2 className="mt-2 text-xl font-semibold">Bạn đang gặp khó ở khâu nào?</h2><p className="mt-2 text-sm leading-6 text-bep-smoke">Hỏi thật lòng, chỉ bảo tận tình. Ai vào bếp cũng từng một lần bỡ ngỡ.</p><form onSubmit={submit} className="mt-5 grid gap-4">
    <label className="text-sm font-semibold">Tên hiển thị người hỏi *<input required minLength={2} maxLength={60} value={name} onChange={(event) => setName(event.target.value)} placeholder="VD: Bé Mai, Bạn Bếp Nhỏ" className={inputClass} /></label>
    <label className="text-sm font-semibold">Tiêu đề câu hỏi ngắn gọn *<input required minLength={5} maxLength={150} value={title} onChange={(event) => setTitle(event.target.value)} placeholder="VD: Làm sao để cá kho không bị tanh?" className={inputClass} /></label>
    <label className="text-sm font-semibold">Kể chi tiết điều bạn muốn hỏi *<textarea required minLength={10} maxLength={3000} rows={4} value={body} onChange={(event) => setBody(event.target.value)} placeholder="Nguyên liệu, cách bạn đã thử và vấn đề đang gặp..." className="mt-1 block w-full rounded-bep-md border border-bep-border bg-bep-canvas p-4 text-sm leading-6" /></label>
    <fieldset><legend className="mb-2 text-sm font-semibold">Thuộc chủ đề nào?</legend><div className="flex flex-wrap gap-2">{(Object.keys(questionCategoryLabels) as QuestionCategory[]).map((item) => <button key={item} type="button" onClick={() => setCategory(item)} aria-pressed={category === item} className={`min-h-11 rounded-bep-md border px-3 text-xs font-semibold ${category === item ? "border-bep-herb bg-bep-herb-light text-bep-herb-ink" : "border-bep-border bg-bep-canvas text-bep-smoke"}`}>{questionCategoryLabels[item]}</button>)}</div></fieldset>
    <div className="absolute -left-[10000px]" aria-hidden="true"><label htmlFor="question-website">Website</label><input id="question-website" tabIndex={-1} autoComplete="off" value={website} onChange={(event) => setWebsite(event.target.value)} /></div>
    {error && <p role="alert" className="text-sm text-bep-error-text">{error}</p>}
    <button type="submit" disabled={pending} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-bep-md bg-bep-primary px-5 font-semibold text-white hover:bg-bep-primary-dark disabled:opacity-60"><Send size={18} /> {pending ? "Đang gửi..." : "Gửi câu hỏi lên Bếp"}</button><p className="text-xs leading-5 text-bep-smoke">Câu hỏi sẽ hiển thị ngay để mọi người cùng chia sẻ.</p>
  </form></div>;
}
