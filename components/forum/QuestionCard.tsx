import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";
import { questionCategoryLabels, type PublicQuestion } from "@/lib/supabase/types";

export function QuestionCard({ question }: { question: PublicQuestion }) {
  return <article className="bep-focus-card group rounded-bep-lg border border-bep-border bg-bep-surface p-5 shadow-bep-card hover:shadow-bep-hover sm:p-6">
    <div className="flex items-start gap-3"><span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-bep-primary-light font-semibold text-bep-primary-dark">{question.display_name.slice(0, 1).toLocaleUpperCase("vi")}</span><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2 text-sm"><strong className="text-bep-ink">{question.display_name}</strong><span className="text-bep-smoke">· {new Date(question.created_at).toLocaleDateString("vi-VN")}</span></div><span className="mt-2 inline-flex rounded-full bg-bep-herb-light px-2.5 py-1 text-xs font-semibold text-bep-herb-ink">{questionCategoryLabels[question.category]}</span></div></div>
    <h3 className="mt-4 text-lg font-semibold leading-7 text-bep-ink group-hover:text-bep-primary-dark"><Link href={`/hoi-bep/${question.id}`} className="bep-link inline-flex min-h-11 items-center rounded-bep-md">{question.title}</Link></h3>
    <p className="mt-2 line-clamp-3 whitespace-pre-wrap text-sm leading-6 text-bep-smoke">{question.body}</p>
    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-bep-border pt-4"><span className="inline-flex items-center gap-2 text-sm text-bep-smoke"><MessageCircle size={17} className="text-bep-herb-ink" /> {question.answer_count} câu trả lời</span><Link href={`/hoi-bep/${question.id}`} className="bep-link inline-flex min-h-11 items-center gap-1 rounded-bep-md text-sm font-semibold text-bep-primary-dark">Xem lời giải đáp <ArrowRight size={17} /></Link></div>
  </article>;
}
