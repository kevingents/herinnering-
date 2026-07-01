"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/admin";
import { isEmailConfigured, sendMagicLinkEmail } from "@/lib/email/resend";
import { siteUrl } from "@/lib/env";

/**
 * Passwordless sign-in. Preferred path: generate a token_hash link server-side
 * and send a BRANDED e-mail via Resend (bypasses Supabase's mailer and its
 * redirect-URL config entirely). Falls back to Supabase's own e-mail if Resend
 * isn't configured or the send fails, so login always works.
 */
export async function signInWithOtp(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!email) {
    redirect("/login?error=" + encodeURIComponent("Vul een e-mailadres in."));
  }

  if (isEmailConfigured()) {
    let sent = false;
    try {
      const svc = createServiceClient();
      const { data, error } = await svc.auth.admin.generateLink({
        type: "magiclink",
        email,
        options: { redirectTo: `${siteUrl()}/auth/callback` },
      });
      const props = data?.properties;
      if (!error && props?.hashed_token) {
        const link = `${siteUrl()}/auth/confirm?token_hash=${props.hashed_token}&type=${props.verification_type || "magiclink"}&next=/dashboard`;
        sent = await sendMagicLinkEmail({ to: email, url: link });
      }
    } catch (e) {
      console.error("branded magic link failed:", e);
    }
    if (sent) redirect("/login?sent=1");
    // else fall through to Supabase's own e-mail
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: `${siteUrl()}/auth/callback?next=/dashboard` },
  });
  if (error) redirect("/login?error=" + encodeURIComponent(error.message));
  redirect("/login?sent=1");
}

/** Sign out and return to the landing page. */
export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
