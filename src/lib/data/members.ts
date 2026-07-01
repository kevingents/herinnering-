import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/admin";

export type Member = {
  id: string;
  invited_email: string | null;
  relation: string | null;
  role: string;
  status: string;
  user_id: string | null;
};

/** Members (invited + active) of a legacy. RLS lets owners/members read these. */
export async function getMembers(legacyId: string): Promise<Member[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("legacy_members")
    .select("id, invited_email, relation, role, status, user_id")
    .eq("legacy_id", legacyId)
    .order("created_at", { ascending: true });

  if (error) throw new Error(error.message);
  return (data ?? []) as Member[];
}

/**
 * Link pending invites (by email) to the freshly logged-in user. Runs via the
 * service client because the invitee isn't a member yet (RLS would block them);
 * safe because we only ever match the caller's own verified email.
 */
export async function claimInvites(
  email: string | undefined,
  userId: string,
): Promise<number> {
  if (!email) return 0;
  const svc = createServiceClient();
  const { data, error } = await svc
    .from("legacy_members")
    .update({
      user_id: userId,
      status: "active",
      accepted_at: new Date().toISOString(),
    })
    .is("user_id", null)
    .eq("status", "invited")
    .ilike("invited_email", email)
    .select("id");

  if (error) {
    console.error("claimInvites failed:", error.message);
    return 0;
  }
  return data?.length ?? 0;
}
