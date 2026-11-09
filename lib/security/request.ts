import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function noStoreJson(data: unknown, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: { "Cache-Control": "private, no-store, max-age=0" },
  });
}

export function sameOrigin(request: NextRequest) {
  const origin = request.headers.get("origin");
  return !origin || origin === request.nextUrl.origin;
}

export async function jsonBody(request: NextRequest) {
  if (!request.headers.get("content-type")?.startsWith("application/json")) return null;
  if (Number(request.headers.get("content-length") ?? 0) > 10_000) return null;
  try {
    const raw = await request.text();
    if (raw.length > 10_000) return null;
    return JSON.parse(raw) as unknown;
  } catch {
    return null;
  }
}
