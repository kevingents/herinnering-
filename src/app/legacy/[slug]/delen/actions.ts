"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const ROLES = ["viewer", "contributor", "admin"] as const;

function friendly(message: string): string {
  if (/row-level security|permission|policy|denied/i.test(message)) {
    return "Alleen de eigenaar kan familie uitnodigen.";
  }
  return "Er ging iets mis. Probeer het opnieuw.";
}

/** Invite a family member by e-mail with a role. Owner-only (enforced by RLS). */
export async function inviteMember(formData: FormData) {
  const slug = String(formData.get("slug") ?? "");
  const legacyId = String(formData.get("legacyId") ?? "");
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const relation = String(formData.get("relation") ?? "").trim() || null;
  const roleRaw = String(formData.get("role") ?? "viewer");
  const role = (ROLES as readonly string[]).includes(roleRaw) ? roleRaw : "viewer";
  const back = `/legacy/${slug}/delen`;

  if (!legacyId || !email) {
    redirect(`${back}?error=${encodeURIComponent("Vul een e-mailadres in.")}`);
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    redirect(`${back}?error=${encodeURIComponent("Vul een geldig e-mailadres in.")}`);
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: existing } = await supabase
    .from("legacy_members")
    .select("id")
    .eq("legacy_id", legacyId)
    .ilike("invited_email", email)
    .neq("status", "revoked")
    .limit(1);
  if (existing && existing.length > 0) {
    redirect(`${back}?error=${encodeURIComponent("Dit e-mailadres is al uitgenodigd.")}`);
  }

  const { error } = await supabase.from("legacy_members").insert({
    legacy_id: legacyId,
    invited_email: email,
    relation,
    role,
    status: "invited",
    invited_by_id: user.id,
  });

  if (error) {
    console.error("inviteMember failed:", error.message);
    redirect(`${back}?error=${encodeURIComponent(friendly(error.message))}`);
  }

  revalidatePath(back);
  redirect(back);
}

/** Remove a member / withdraw an invite. Owner-only (enforced by RLS). */
export async function revokeMember(formData: FormData) {
  const slug = String(formData.get("slug") ?? "");
  const memberId = String(formData.get("memberId") ?? "");
  const back = `/legacy/${slug}/delen`;
  if (!memberId) redirect(back);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { error } = await supabase.from("legacy_members").delete().eq("id", memberId);
  if (error) {
    console.error("revokeMember failed:", error.message);
    redirect(`${back}?error=${encodeURIComponent(friendly(error.message))}`);
  }

  revalidatePath(back);
  redirect(back);
}
