"use server";

import { createServiceClient } from "@/lib/supabase/admin";

type Result = { ok: true } | { error: string };

/** Public B2B lead form. Writes via the service client; the table has RLS on
 *  with no policies, so leads are never readable by anon/authenticated. */
export async function submitPartnerLead(formData: FormData): Promise<Result> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const organization = String(formData.get("organization") ?? "").trim() || null;
  const phone = String(formData.get("phone") ?? "").trim() || null;
  const message = String(formData.get("message") ?? "").trim() || null;

  if (!name || !email) return { error: "Vul je naam en e-mailadres in." };
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return { error: "Vul een geldig e-mailadres in." };
  }

  try {
    const svc = createServiceClient();
    const { error } = await svc
      .from("partner_leads")
      .insert({ name, email, organization, phone, message });
    if (error) {
      console.error("partner lead insert failed:", error.message);
      return { error: "Er ging iets mis. Probeer het later opnieuw." };
    }
    return { ok: true };
  } catch (e) {
    console.error("partner lead failed:", e);
    return { error: "Er ging iets mis. Probeer het later opnieuw." };
  }
}
