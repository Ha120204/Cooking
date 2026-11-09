import { MessageCircle } from "lucide-react";
import type { PublicAnswer } from "@/lib/supabase/types";

export function AnswerList({ answers }: { answers: PublicAnswer[] }) {
  return <section aria-labelledby="answers-title"><h2 id="answers-title" className="flex items-center gap-2 text-xl font-semibold text-bep-ink"><MessageCircle size={21} className="text-bep-primary-dark" /> {answers.length} câu trả lời</h2>
    {answers.length ? <div className="mt-5 space-y-4">{answers.map((answer) => <article id={`answer-${answer.id}`} tabIndex={-1} key={answer.id} className="scroll-mt-24 rounded-bep-lg border border-bep-border bg-bep-surface p-5 shadow-bep-card focus:outline-2 focus:outline-offset-2 focus:outline-bep-primary-dark sm:p-6"><div className="flex items-center gap-3"><span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-bep-herb-light font-semibold text-bep-herb-ink">{answer.display_name.slice(0, 1).toLocaleUpperCase("vi")}</span><div><h3 className="font-semibold text-bep-ink">{answer.display_name}</h3><time dateTime={answer.created_at} className="text-xs text-bep-smoke">{new Date(answer.created_at).toLocaleString("vi-VN")}</time></div></div><p className="mt-4 whitespace-pre-wrap break-words text-sm leading-7 text-bep-smoke">{answer.body}</p></article>)}</div>
      : <div className="mt-5 rounded-bep-lg bg-bep-dim p-6 text-sm leading-6 text-bep-smoke">Chưa có lời giải đáp. Bạn có mẹo nào muốn chia sẻ không?</div>}
  </section>;
}
