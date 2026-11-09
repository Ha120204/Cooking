import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import { Header } from "@/components/layout/Header";
import { MobileNav } from "@/components/layout/MobileNav";
import { Footer } from "@/components/layout/Footer";
import { QuestionDetail } from "@/components/forum/QuestionDetail";
import { publicSupabase } from "@/lib/supabase/server";
import type { PublicAnswer, PublicQuestion } from "@/lib/supabase/types";
import { questionIdSchema } from "@/lib/validation/forum";

type Props = { params: Promise<{ id: string }> };

const getVisibleQuestion = cache(async (id: string) => {
  if (!questionIdSchema.safeParse(id).success) return null;
  const { data, error } = await publicSupabase().from("questions")
    .select("id,display_name,title,body,category,created_at")
    .eq("id", id).maybeSingle();
  if (error) throw error;
  return data;
});

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const question = await getVisibleQuestion(id);
  if (!question) notFound();
  return {
    title: `${question.title} | Hỏi bếp | Bếp Nhà Mình`,
    description: question.body.slice(0, 160),
    alternates: { canonical: `/hoi-bep/${id}` },
  };
}

export default async function QuestionPage({ params }: Props) {
  const { id } = await params;
  const question = await getVisibleQuestion(id);
  if (!question) notFound();
  const { data: answers, error } = await publicSupabase().from("answers")
    .select("id,question_id,display_name,body,created_at")
    .eq("question_id", id).order("created_at", { ascending: true }).limit(100);
  if (error) throw error;
  const initialAnswers = (answers ?? []) as PublicAnswer[];
  const visibleQuestion: PublicQuestion = { ...question, answer_count: initialAnswers.length };
  return <><Header active="forum" /><main className="pt-16 lg:pt-20"><QuestionDetail question={visibleQuestion} initialAnswers={initialAnswers} /></main><Footer /><MobileNav active="forum" /></>;
}
