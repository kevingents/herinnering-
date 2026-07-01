"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { RELATIONS } from "@/lib/relations";

const RELATION_KEYS = RELATIONS.map((r) => r.key) as readonly string[];

/** Map raw DB/RLS errors to a friendly Dutch message (raw is logged, not shown). */
function friendly(message: string): string {
  if (/row-level security|permission|policy|denied/i.test(message)) {
    return "Je hebt geen rechten om dit te wijzigen.";
  }
  if (/uuid|invalid input/i.test(message)) return "Ongeldige invoer.";
  return "Er ging iets mis. Probeer het opnieuw.";
}

/** Add a family member (person) to a legacy. */
export async function addPerson(formData: FormData) {
  const slug = String(formData.get("slug") ?? "");
  const legacyId = String(formData.get("legacyId") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const relationRaw = String(formData.get("relation") ?? "anders");
  const relation = RELATION_KEYS.includes(relationRaw) ? relationRaw : "anders";
  const notes = String(formData.get("notes") ?? "").trim() || null;
  const back = `/legacy/${slug}/familie`;

  if (!legacyId || !name) {
    redirect(`${back}?error=${encodeURIComponent("Vul een naam in.")}`);
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: canEdit } = await supabase.rpc("can_edit_legacy", {
    p_legacy: legacyId,
  });
  if (!canEdit) {
    redirect(`${back}?error=${encodeURIComponent("Je hebt geen rechten om dit te wijzigen.")}`);
  }

  const { error } = await supabase
    .from("people")
    .insert({ legacy_id: legacyId, name, relation, notes });

  if (error) {
    console.error("addPerson failed:", error.message);
    redirect(`${back}?error=${encodeURIComponent(friendly(error.message))}`);
  }

  revalidatePath(back);
  redirect(back);
}

/** Remove a family member. */
export async function removePerson(formData: FormData) {
  const slug = String(formData.get("slug") ?? "");
  const personId = String(formData.get("personId") ?? "");
  const back = `/legacy/${slug}/familie`;

  if (!personId) redirect(back);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { error } = await supabase.from("people").delete().eq("id", personId);
  if (error) {
    console.error("removePerson failed:", error.message);
    redirect(`${back}?error=${encodeURIComponent(friendly(error.message))}`);
  }

  revalidatePath(back);
  redirect(back);
}
