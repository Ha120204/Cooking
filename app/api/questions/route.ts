import type { NextRequest } from "next/server";
import { checkRateLimit } from "@/lib/security/rate-limit";
import { jsonBody, noStoreJson, sameOrigin } from "@/lib/security/request";
import { adminSupabase, publicSupabase } from "@/lib/supabase/server";
import type { PublicQuestion } from "@/lib/supabase/types";
import { questionSchema } from "@/lib/validation/forum";

export async function GET() {
  try {
    const db = publicSupabase();
    const { data: questions, error } = await db.from("questions")
      .select("id,display_name,title,body,category,created_at")
      .order("created_at", { ascending: false })
      .limit(100);
    if (error) throw error;
    const ids = (questions ?? []).map((question) => question.id);
    const counts = new Map<string, number>();
    if (ids.length) {
      const { data: answers, error: answerError } = await db.from("answers")
        .select("question_id").in("question_id", ids).limit(5000);
      if (answerError) throw answerError;
      for (const answer of answers ?? []) counts.set(answer.question_id, (counts.get(answer.question_id) ?? 0) + 1);
    }
    const result: PublicQuestion[] = (questions ?? []).map((question) => ({
      ...question, answer_count: counts.get(question.id) ?? 0,
    }));
    return noStoreJson({ questions: result });
  } catch (error) {
    console.error("questions GET failed", error);
    return noStoreJson({ error: "Chưa tải được câu hỏi." }, 503);
  }
}

export async function POST(request: NextRequest) {
  if (!sameOrigin(request)) return noStoreJson({ error: "Yêu cầu không hợp lệ." }, 403);
  const parsed = questionSchema.safeParse(await jsonBody(request));
  if (!parsed.success || parsed.data.website) return noStoreJson({ error: "Câu hỏi không hợp lệ." }, 400);
  try {
    if (!await checkRateLimit(request, "question")) {
      return noStoreJson({ error: "Bạn đã đặt 2 câu hỏi trong giờ này. Hãy thử lại sau." }, 429);
    }
    const { data, error } = await adminSupabase().from("questions")
      .insert({
        display_name: parsed.data.display_name,
        title: parsed.data.title,
        body: parsed.data.body,
        category: parsed.data.category,
      })
      .select("id,display_name,title,body,category,created_at")
      .single();
    if (error) throw error;
    return noStoreJson({ question: { ...data, answer_count: 0 } }, 201);
  } catch (error) {
    console.error("question POST failed", error);
    return noStoreJson({ error: "Chưa gửi được câu hỏi." }, 503);
  }
}
