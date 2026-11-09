"use client";

import { useEffect, useMemo, useState } from "react";
import { ChefHat, Search } from "lucide-react";
import { questionCategoryLabels, type PublicQuestion, type QuestionCategory } from "@/lib/supabase/types";
import { QuestionCard } from "./QuestionCard";

export function QuestionList() {
  const [questions, setQuestions] = useState<PublicQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<QuestionCategory | "all">("all");
  const [sort, setSort] = useState<"newest" | "answered">("newest");

  async function load(signal?: AbortSignal) {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/questions", { cache: "no-store", signal });
      if (!response.ok) throw new Error("Chưa tải được câu hỏi.");
      const result = await response.json() as { questions: PublicQuestion[] };
      if (!signal?.aborted) setQuestions(result.questions);
    } catch (reason) {
      if (!signal?.aborted) setError(reason instanceof Error ? reason.message : "Chưa tải được câu hỏi.");
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }

  useEffect(() => { const controller = new AbortController(); void load(controller.signal); return () => controller.abort(); }, []);

  const shown = useMemo(() => questions
    .filter((question) => category === "all" || question.category === category)
    .filter((question) => [question.title, question.body].some((value) => value.toLocaleLowerCase("vi").includes(query.trim().toLocaleLowerCase("vi"))))
    .sort((a, b) => sort === "answered" ? b.answer_count - a.answer_count || b.created_at.localeCompare(a.created_at) : b.created_at.localeCompare(a.created_at)), [questions, category, query, sort]);

  return <section aria-labelledby="questions-heading" className="space-y-5"><div className="rounded-bep-lg border border-bep-border bg-bep-surface p-4 shadow-bep-card sm:p-5"><h2 id="questions-heading" className="mb-3 text-xl font-semibold">Chuyện đang rôm rả quanh bếp</h2><label className="bep-field-frame flex min-h-11 items-center gap-2 rounded-bep-md border border-bep-border bg-bep-canvas px-3"><Search size={19} className="text-bep-primary-dark" /><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm mẹo khử tanh, ướp thịt, chọn rau..." aria-label="Tìm câu hỏi" className="w-full min-w-0 bg-transparent text-sm" /></label></div>
    <div className="flex flex-wrap gap-2"><button type="button" onClick={() => setCategory("all")} aria-pressed={category === "all"} className={`bep-chip min-h-11 rounded-full border px-4 text-sm font-semibold ${category === "all" ? "border-bep-primary-dark bg-bep-primary-light text-bep-primary-dark" : "border-bep-border bg-white text-bep-smoke"}`}>Tất cả</button>{(Object.keys(questionCategoryLabels) as QuestionCategory[]).map((item) => <button key={item} type="button" onClick={() => setCategory(item)} aria-pressed={category === item} className={`bep-chip min-h-11 rounded-full border px-4 text-sm font-semibold ${category === item ? "border-bep-primary-dark bg-bep-primary-light text-bep-primary-dark" : "border-bep-border bg-white text-bep-smoke"}`}>{questionCategoryLabels[item]}</button>)}</div>
    <div className="flex flex-wrap items-center justify-between gap-3 px-1 text-sm text-bep-smoke"><span>{loading ? "Đang nhóm bếp..." : `${shown.length} câu hỏi`}</span><label>Sắp xếp <select value={sort} onChange={(event) => setSort(event.target.value as "newest" | "answered")} className="ml-2 min-h-11 rounded-bep-sm border border-bep-border bg-white px-2 font-semibold text-bep-ink"><option value="newest">Mới nhất</option><option value="answered">Nhiều lời giải đáp nhất</option></select></label></div>
    {error && <div role="alert" className="rounded-bep-lg border border-bep-error-border bg-bep-surface p-6 text-sm text-bep-error-text">{error}<button type="button" onClick={() => void load()} className="bep-action bep-action-muted ml-3 min-h-11 rounded-bep-md px-2 font-semibold underline">Thử lại</button></div>}
    {loading ? <div className="space-y-4" aria-label="Đang tải câu hỏi">{[1, 2, 3].map((item) => <div key={item} className="h-36 animate-pulse rounded-bep-lg bg-bep-dim" />)}</div> : !error && shown.length ? <div className="space-y-4">{shown.map((question) => <QuestionCard key={question.id} question={question} />)}</div> : !error && <div className="rounded-bep-lg border border-bep-border bg-white p-10 text-center"><ChefHat size={40} className="mx-auto text-bep-primary-dark" /><p className="mt-3 font-semibold">Góc bếp chưa có câu hỏi phù hợp</p><p className="mt-2 text-sm text-bep-smoke">Hãy đặt câu hỏi đầu tiên hoặc thử tìm một chủ đề khác nhé.</p></div>}
  </section>;
}
