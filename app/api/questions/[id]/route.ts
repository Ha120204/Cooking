import type { NextRequest } from "next/server";
import { noStoreJson } from "@/lib/security/request";
import { publicSupabase } from "@/lib/supabase/server";
import { questionIdSchema } from "@/lib/validation/forum";

type Context = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: Context) {
  const { id } = await params;
  if (!questionIdSchema.safeParse(id).success) return noStoreJson({ error: "Không tìm thấy câu hỏi." }, 404);
  try {
    const db = publicSupabase();
    const { data: question, error } = await db.from("questions")
      .select("id,display_name,title,body,category,created_at")
      .eq("id", id).maybeSingle();
    if (error) throw error;
    if (!question) return noStoreJson({ error: "Không tìm thấy câu hỏi." }, 404);
    const { data: answers, error: answerError } = await db.from("answers")
      .select("id,question_id,display_name,body,created_at")
      .eq("question_id", id).order("created_at", { ascending: true }).limit(100);
    if (answerError) throw answerError;
    return noStoreJson({ question: { ...question, answer_count: answers?.length ?? 0 }, answers: answers ?? [] });
  } catch (error) {
    console.error("question detail GET failed", error);
    return noStoreJson({ error: "Chưa tải được câu hỏi." }, 503);
  }
}
