"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { siteUrl } from "@/lib/env";

type Provider = "google" | "apple" | "azure";

/** Send a magic link (passwordless email sign-in). */
export async function signInWithOtp(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  if (!email) redirect("/login?error=" + encodeURIComponent("Vul een e-mailadres in."));

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${siteUrl()}/auth/confirm?next=/dashboard`,
    },
  });

  if (error) redirect("/login?error=" + encodeURIComponent(error.message));
  redirect("/login?sent=1");
}

/** Start an OAuth sign-in and redirect to the provider. */
export async function signInWithProvider(formData: FormData) {
  const provider = String(formData.get("provider") ?? "") as Provider;
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: { redirectTo: `${siteUrl()}/auth/callback?next=/dashboard` },
  });

  if (error) redirect("/login?error=" + encodeURIComponent(error.message));
  if (data?.url) redirect(data.url);
}

/** Sign out and return to the landing page. */
export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
