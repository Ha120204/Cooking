import type { NextRequest } from "next/server";
import { checkRateLimit } from "@/lib/security/rate-limit";
import { jsonBody, noStoreJson, sameOrigin } from "@/lib/security/request";
import { adminSupabase, publicSupabase } from "@/lib/supabase/server";
import { answerSchema, questionIdSchema } from "@/lib/validation/forum";

type Context = { params: Promise<{ id: string }> };

export async function POST(request: NextRequest, { params }: Context) {
  if (!sameOrigin(request)) return noStoreJson({ error: "Yêu cầu không hợp lệ." }, 403);
  const { id } = await params;
  if (!questionIdSchema.safeParse(id).success) return noStoreJson({ error: "Không tìm thấy câu hỏi." }, 404);
  const parsed = answerSchema.safeParse(await jsonBody(request));
  if (!parsed.success || parsed.data.website) return noStoreJson({ error: "Câu trả lời không hợp lệ." }, 400);
  try {
    const { data: question, error: questionError } = await publicSupabase().from("questions")
      .select("id").eq("id", id).maybeSingle();
    if (questionError) throw questionError;
    if (!question) return noStoreJson({ error: "Không tìm thấy câu hỏi." }, 404);
    if (!await checkRateLimit(request, "answer")) {
      return noStoreJson({ error: "Bạn đã gửi 5 câu trả lời trong 10 phút. Hãy thử lại sau." }, 429);
    }
    const { data, error } = await adminSupabase().from("answers")
      .insert({ question_id: id, display_name: parsed.data.display_name, body: parsed.data.body })
      .select("id,question_id,display_name,body,created_at")
      .single();
    if (error) throw error;
    return noStoreJson({ answer: data }, 201);
  } catch (error) {
    console.error("answer POST failed", error);
    return noStoreJson({ error: "Chưa gửi được câu trả lời." }, 503);
  }
}
