"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function genCode(): string {
  return (
    Math.random().toString(36).slice(2, 8) +
    Math.random().toString(36).slice(2, 8)
  ).slice(0, 12);
}

/** Create a QR marker (once) and make the legacy publicly visitable. */
export async function activateGrafmodus(formData: FormData) {
  const slug = String(formData.get("slug") ?? "");
  const legacyId = String(formData.get("legacyId") ?? "");
  const back = `/legacy/${slug}/grafmodus`;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: existing } = await supabase
    .from("grave_markers")
    .select("id")
    .eq("legacy_id", legacyId)
    .limit(1);

  if (!existing || existing.length === 0) {
    const { error } = await supabase.from("grave_markers").insert({
      legacy_id: legacyId,
      code: genCode(),
      type: "qr",
      is_active: true,
    });
    if (error) redirect(`${back}?error=${encodeURIComponent(error.message)}`);
  }

  await supabase.from("legacies").update({ is_public: true }).eq("id", legacyId);

  revalidatePath(back);
  redirect(back);
}

/** Turn a marker (and thus the public memorial) on or off. */
export async function setMarkerActive(formData: FormData) {
  const slug = String(formData.get("slug") ?? "");
  const markerId = String(formData.get("markerId") ?? "");
  const active = String(formData.get("active") ?? "") === "true";
  const back = `/legacy/${slug}/grafmodus`;

  const supabase = await createClient();
  const { error } = await supabase
    .from("grave_markers")
    .update({ is_active: active })
    .eq("id", markerId);
  if (error) redirect(`${back}?error=${encodeURIComponent(error.message)}`);

  revalidatePath(back);
  redirect(back);
}
