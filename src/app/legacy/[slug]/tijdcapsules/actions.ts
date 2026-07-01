"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const TRIGGERS = ["date", "event", "after_death", "years_after"] as const;

/** Create a sealed time capsule that opens at a future moment. */
export async function createTimeCapsule(formData: FormData) {
  const slug = String(formData.get("slug") ?? "");
  const legacyId = String(formData.get("legacyId") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim() || null;
  const triggerRaw = String(formData.get("trigger") ?? "date");
  const trigger = (TRIGGERS as readonly string[]).includes(triggerRaw)
    ? triggerRaw
    : "date";
  const recipientEmail = String(formData.get("recipientEmail") ?? "").trim() || null;
  const back = `/legacy/${slug}/tijdcapsules`;

  if (!legacyId || !title) {
    redirect(`${back}?error=${encodeURIComponent("Geef de tijdcapsule een titel.")}`);
  }

  const unlockDate =
    trigger === "date" ? String(formData.get("unlockDate") ?? "").trim() || null : null;
  const yearsAfter =
    trigger === "years_after"
      ? Math.round(Number(formData.get("yearsAfter") ?? 0)) || null
      : null;
  const unlockCondition =
    trigger === "event" ? String(formData.get("unlockCondition") ?? "").trim() || null : null;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { error } = await supabase.from("time_capsules").insert({
    legacy_id: legacyId,
    created_by_id: user.id,
    title,
    message,
    trigger,
    unlock_date: unlockDate,
    years_after: yearsAfter,
    unlock_condition: unlockCondition,
    recipient_email: recipientEmail,
  });

  if (error) redirect(`${back}?error=${encodeURIComponent(error.message)}`);

  revalidatePath(back);
  redirect(back);
}
