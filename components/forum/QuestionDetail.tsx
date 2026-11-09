"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ChefHat, HeartHandshake } from "lucide-react";
import { questionCategoryLabels, type PublicAnswer, type PublicQuestion } from "@/lib/supabase/types";
import { AnswerList } from "./AnswerList";
import { AnswerForm } from "./AnswerForm";

export function QuestionDetail({ question, initialAnswers }: { question: PublicQuestion; initialAnswers: PublicAnswer[] }) {
  const [answers, setAnswers] = useState(initialAnswers);
  return <div className="mx-auto max-w-[1200px] px-4 pb-16 pt-6 sm:px-6 lg:px-8 lg:pt-10"><nav aria-label="Đường dẫn" className="mb-4 text-sm text-bep-smoke"><Link href="/" className="text-bep-primary-dark hover:underline">Trang chủ</Link> / <Link href="/hoi-bep" className="text-bep-primary-dark hover:underline">Hỏi bếp</Link> / Câu hỏi</nav><Link href="/hoi-bep" className="mb-5 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-bep-primary-dark"><ArrowLeft size={18} /> Quay lại Hỏi bếp</Link>
    <div className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(260px,1fr)] lg:items-start"><div className="space-y-7"><article className="rounded-bep-lg border border-bep-border bg-bep-surface p-6 shadow-bep-card sm:p-8"><span className="inline-flex rounded-full bg-bep-herb-light px-3 py-1 text-xs font-semibold text-bep-herb">{questionCategoryLabels[question.category]}</span><h1 className="mt-4 text-[26px] font-bold leading-[1.3] text-bep-ink lg:text-[32px]">{question.title}</h1><div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-bep-smoke"><span className="flex size-9 items-center justify-center rounded-full bg-bep-primary-light font-semibold text-bep-primary-dark">{question.display_name.slice(0, 1).toLocaleUpperCase("vi")}</span><strong className="text-bep-ink">{question.display_name}</strong><span>·</span><time dateTime={question.created_at}>{new Date(question.created_at).toLocaleDateString("vi-VN")}</time></div><p className="mt-6 whitespace-pre-wrap break-words border-t border-bep-border pt-6 text-base leading-8 text-bep-smoke">{question.body}</p></article>
      <AnswerList answers={answers} /><AnswerForm questionId={question.id} onCreated={(answer) => setAnswers((current) => [...current, answer])} /></div>
      <aside className="hidden space-y-5 lg:sticky lg:top-24 lg:block"><div className="rounded-bep-lg bg-bep-herb-light p-6"><h2 className="flex items-center gap-2 text-lg font-semibold text-bep-herb"><HeartHandshake size={20} /> Góc trò chuyện mộc mạc</h2><p className="mt-3 text-sm leading-7 text-bep-smoke">Hỏi bếp là nơi cùng học từ những bữa cơm nhà. Hãy chia sẻ mẹo bạn đã thử và giữ lời lẽ thân thiện.</p></div><div className="rounded-bep-lg border border-bep-border bg-bep-surface p-6"><h2 className="flex items-center gap-2 font-semibold"><ChefHat size={20} className="text-bep-primary-dark" /> Món ngon tham khảo</h2><p className="mt-2 text-sm leading-6 text-bep-smoke">Tìm thêm món ăn và cách làm từ gian bếp.</p><Link href="/cong-thuc" className="mt-3 inline-flex min-h-11 items-center text-sm font-semibold text-bep-primary-dark">Khám phá công thức →</Link></div></aside></div>
  </div>;
}
