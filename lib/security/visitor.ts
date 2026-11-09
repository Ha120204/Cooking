import { createHmac, randomBytes } from "node:crypto";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const cookieName = "bep_visitor";

function secret() {
  const value = process.env.IP_HASH_SECRET;
  if (!value || value.length < 32) throw new Error("IP_HASH_SECRET must be at least 32 characters");
  return value;
}

export function keyedHash(purpose: string, value: string) {
  return createHmac("sha256", secret()).update(`${purpose}:${value}`).digest("hex");
}

export function visitorIdentity(request: NextRequest, create: boolean) {
  const existing = request.cookies.get(cookieName)?.value;
  const valid = existing && /^[0-9a-f]{64}$/.test(existing) ? existing : null;
  const token = valid ?? (create ? randomBytes(32).toString("hex") : null);
  return { hash: token ? keyedHash("visitor", token) : null, newToken: valid ? null : token };
}

export function setVisitorCookie(response: NextResponse, token: string | null) {
  if (token) response.cookies.set(cookieName, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
  return response;
}

export function ipHash(request: NextRequest, action: string) {
  const forwarded = request.headers.get("x-vercel-forwarded-for")
    ?? request.headers.get("x-forwarded-for")
    ?? request.headers.get("x-real-ip");
  const ip = forwarded?.split(",")[0]?.trim() || "unknown";
  return keyedHash(`rate:${action}`, ip);
}
