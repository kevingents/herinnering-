import { createClient } from "@/lib/supabase/server";

/**
 * Platform admins. The list lives in the ADMIN_EMAILS env (comma-separated).
 * Falls back to the founder's address so the admin area works out of the box.
 */
const DEFAULT_ADMIN = "kevin@gents.nl";

function adminEmails(): string[] {
  const raw = process.env.ADMIN_EMAILS ?? DEFAULT_ADMIN;
  return raw
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

export type AdminUser = { id: string; email: string };

/** The current user if they are a platform admin, otherwise null. */
export async function requireAdmin(): Promise<AdminUser | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const email = user?.email?.toLowerCase();
  if (!user || !email) return null;
  if (!adminEmails().includes(email)) return null;
  return { id: user.id, email };
}

export async function isAdmin(): Promise<boolean> {
  return (await requireAdmin()) !== null;
}
