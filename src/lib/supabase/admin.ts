import { createClient } from "@supabase/supabase-js";
import { publicEnv, serverEnv } from "@/lib/env";
import type { Database } from "@/lib/supabase/types";

/**
 * SERVER-ONLY service-role client. Bypasses RLS — never import this in a client
 * component and never return raw rows to the browser. Used for the public
 * memorial read path (/graf/[code]), where access is gated explicitly in code
 * (active marker) rather than by RLS.
 */
export function createServiceClient() {
  const { NEXT_PUBLIC_SUPABASE_URL } = publicEnv();
  const { SUPABASE_SERVICE_ROLE_KEY } = serverEnv();
  if (!SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY ontbreekt — grafmodus is niet beschikbaar.");
  }
  return createClient<Database>(NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
