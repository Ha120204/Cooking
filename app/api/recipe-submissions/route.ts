import type { NextRequest } from "next/server";
import { checkRateLimit } from "@/lib/security/rate-limit";
import { jsonBody, noStoreJson, sameOrigin } from "@/lib/security/request";
import { adminSupabase } from "@/lib/supabase/server";
import { submissionSchema } from "@/lib/validation/submissions";

export async function POST(request: NextRequest) {
  if (!sameOrigin(request)) return noStoreJson({ error: "Yêu cầu không hợp lệ." }, 403);
  const parsed = submissionSchema.safeParse(await jsonBody(request, 64_000));
  if (!parsed.success || parsed.data.website) {
    return noStoreJson({ error: "Vui lòng kiểm tra các trường và xác nhận quyền chia sẻ." }, 400);
  }
  try {
    if (!await checkRateLimit(request, "recipe_submission")) {
      return noStoreJson({ error: "Bạn đã gửi 2 công thức trong giờ này. Hãy thử lại sau." }, 429);
    }
    const { data, error } = await adminSupabase().from("recipe_submissions")
      .insert({
        display_name: parsed.data.display_name,
        title: parsed.data.title,
        description: parsed.data.description,
        ingredients: parsed.data.ingredients,
        steps: parsed.data.steps.map((step, index) => `${index + 1}. ${step}`).join("\n\n"),
        image_url: parsed.data.image_url || null,
        image_credit: parsed.data.image_credit || null,
        rights_confirmed_at: new Date().toISOString(),
        status: "pending",
      })
      .select("id,status")
      .single();
    if (error) throw error;
    return noStoreJson({ id: data.id, status: data.status }, 201);
  } catch (error) {
    console.error("recipe submission POST failed", error);
    return noStoreJson({ error: "Chưa gửi được công thức. Hãy thử lại sau." }, 503);
  }
}
