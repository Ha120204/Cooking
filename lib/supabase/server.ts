import { createClient } from "@supabase/supabase-js";

function supabaseUrl() {
  const url = process.env.SUPABASE_URL;
  if (!url) throw new Error("SUPABASE_URL is missing");
  return url;
}

function client(key: string) {
  return createClient(supabaseUrl(), key, {
    auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false },
    global: { fetch: (input, init) => fetch(input, { ...init, cache: "no-store" }) },
  });
}

export function publicSupabase() {
  const key = process.env.SUPABASE_ANON_KEY ?? process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!key) throw new Error("Supabase public key is missing");
  return client(key);
}

export function adminSupabase() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SECRET_KEY;
  if (!key) throw new Error("Supabase server key is missing");
  return client(key);
}
