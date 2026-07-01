"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/admin";

/** Best-effort removal of all Storage objects under a legacy's folder. */
async function purgeLegacyStorage(legacyId: string) {
  const svc = createServiceClient();
  for (const sub of ["voice", "photos", "documents"]) {
    const { data } = await svc.storage
      .from("media")
      .list(`${legacyId}/${sub}`, { limit: 1000 });
    if (data && data.length > 0) {
      await svc.storage
        .from("media")
        .remove(data.map((o) => `${legacyId}/${sub}/${o.name}`));
    }
  }
}

/** Permanently delete one legacy (owner only via RLS) + its files. */
export async function deleteLegacy(formData: FormData) {
  const legacyId = String(formData.get("legacyId") ?? "");
  if (!legacyId) redirect("/account");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { error } = await supabase.from("legacies").delete().eq("id", legacyId);
  if (error) {
    console.error("deleteLegacy failed:", error.message);
    redirect(
      "/account?error=" + encodeURIComponent("Verwijderen is niet gelukt."),
    );
  }

  await purgeLegacyStorage(legacyId);
  revalidatePath("/account");
  redirect("/account?deleted=1");
}

/** Permanently delete the account and ALL data (AVG right to erasure). */
export async function deleteAccount() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Purge storage for every legacy the user owns, then delete the auth user —
  // the DB cascades profiles → legacies → all content.
  const { data: owned } = await supabase
    .from("legacies")
    .select("id")
    .eq("owner_id", user.id);
  for (const l of (owned ?? []) as { id: string }[]) {
    await purgeLegacyStorage(l.id);
  }

  const svc = createServiceClient();
  const { error } = await svc.auth.admin.deleteUser(user.id);
  if (error) {
    console.error("deleteAccount failed:", error.message);
    redirect(
      "/account?error=" +
        encodeURIComponent("Account verwijderen is niet gelukt. Neem contact op."),
    );
  }

  await supabase.auth.signOut();
  redirect("/?verwijderd=1");
}
