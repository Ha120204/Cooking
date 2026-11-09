"use client";

import { useState, type FormEvent } from "react";
import { Send } from "lucide-react";
import type { PublicAnswer } from "@/lib/supabase/types";
import { answerSchema } from "@/lib/validation/forum";

export function AnswerForm({ questionId, onCreated }: { questionId: string; onCreated: (answer: PublicAnswer) => void }) {
  const [name, setName] = useState("");
  const [body, setBody] = useState("");
  const [website, setWebsite] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    setError(""); setSuccess("");
    const input = answerSchema.safeParse({ display_name: name, body, website });
    if (!input.success) { setError("Vui lòng nhập tên và nội dung câu trả lời."); return; }
    setPending(true);
    try {
      const response = await fetch(`/api/questions/${questionId}/answers`, {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(input.data),
      });
      const data = await response.json() as { answer?: PublicAnswer; error?: string };
      if (!response.ok || !data.answer) throw new Error(data.error ?? "Chưa gửi được câu trả lời.");
      onCreated(data.answer);
      setBody("");
      setSuccess("Câu trả lời của bạn đã hiển thị trong gian bếp.");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Chưa gửi được câu trả lời.");
    } finally {
      setPending(false);
    }
  }

  return <section className="rounded-bep-lg border border-bep-border bg-bep-surface p-5 shadow-bep-card sm:p-7"><h2 className="text-xl font-semibold">Gửi câu trả lời của bạn</h2><p className="mt-2 text-sm leading-6 text-bep-smoke">Chia sẻ kinh nghiệm nêm nếm hoặc mẹo nhỏ để gian bếp chúng mình thêm ấm cúng.</p><form onSubmit={submit} className="mt-5 grid gap-4"><label className="text-sm font-semibold">Tên hiển thị của bạn *<input required minLength={2} maxLength={60} value={name} onChange={(event) => setName(event.target.value)} placeholder="Tên của bạn" className="mt-1 block min-h-12 w-full rounded-bep-md border border-bep-border bg-bep-canvas px-4" /></label><label className="text-sm font-semibold">Nội dung câu trả lời *<textarea required minLength={2} maxLength={3000} rows={5} value={body} onChange={(event) => setBody(event.target.value)} placeholder="Bạn đã xử lý tình huống này thế nào?" className="mt-1 block w-full rounded-bep-md border border-bep-border bg-bep-canvas p-4 text-sm leading-7" /></label>
    <div className="absolute -left-[10000px]" aria-hidden="true"><label htmlFor="answer-website">Website</label><input id="answer-website" tabIndex={-1} autoComplete="off" value={website} onChange={(event) => setWebsite(event.target.value)} /></div>
    {error && <p role="alert" className="text-sm text-bep-error-text">{error}</p>}{success && <p role="status" className="text-sm font-semibold text-bep-herb">{success}</p>}
    <button type="submit" disabled={pending} className="inline-flex min-h-12 w-fit items-center gap-2 rounded-bep-md bg-bep-primary px-6 font-semibold text-white hover:bg-bep-primary-dark disabled:opacity-60"><Send size={18} /> {pending ? "Đang gửi..." : "Gửi câu trả lời"}</button><p className="text-xs text-bep-smoke">Câu trả lời xuất hiện ngay và có thể được ẩn nếu vi phạm quy tắc cộng đồng.</p>
  </form></section>;
}
