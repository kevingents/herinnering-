"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/** Add a life event (timeline milestone) to a legacy. RLS enforces edit rights. */
export async function createLifeEvent(formData: FormData) {
  const slug = String(formData.get("slug") ?? "");
  const legacyId = String(formData.get("legacyId") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const category = String(formData.get("category") ?? "other");
  const eventDate = String(formData.get("eventDate") ?? "").trim() || null;
  const description = String(formData.get("description") ?? "").trim() || null;

  const back = `/legacy/${slug}`;
  if (!legacyId || !title) {
    redirect(`${back}?error=${encodeURIComponent("Titel is verplicht.")}`);
  }

  const supabase = await createClient();
  const { error } = await supabase.from("life_events").insert({
    legacy_id: legacyId,
    title,
    category,
    event_date: eventDate,
    description,
    date_precision: eventDate ? "day" : "year",
  });

  if (error) {
    redirect(`${back}?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath(back);
  redirect(back);
}
