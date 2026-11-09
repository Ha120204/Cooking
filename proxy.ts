import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { publicSupabase } from "@/lib/supabase/server";
import { questionIdSchema } from "@/lib/validation/forum";

export async function proxy(request: NextRequest) {
  const id = request.nextUrl.pathname.split("/")[2];
  if (id === "opengraph-image") return NextResponse.next();
  if (!questionIdSchema.safeParse(id).success) {
    return NextResponse.rewrite(new URL("/_not-found", request.url), { status: 404 });
  }
  try {
    const { data, error } = await publicSupabase().from("questions")
      .select("id").eq("id", id).maybeSingle();
    if (error) throw error;
    if (!data) return NextResponse.rewrite(new URL("/_not-found", request.url), { status: 404 });
  } catch (error) {
    console.error("question availability check failed", error);
  }
  return NextResponse.next();
}

export const config = { matcher: "/hoi-bep/:id" };
