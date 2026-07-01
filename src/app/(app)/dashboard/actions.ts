"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(new RegExp("[\\u0300-\\u036f]", "g"), "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}

/** Create a new legacy owned by the current user. */
export async function createLegacy(formData: FormData) {
  const fullName = String(formData.get("fullName") ?? "").trim();
  if (!fullName) {
    redirect("/dashboard?error=" + encodeURIComponent("Vul een naam in."));
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const slug = `${slugify(fullName) || "nalatenschap"}-${Math.random().toString(36).slice(2, 7)}`;
  const { error } = await supabase.from("legacies").insert({
    owner_id: user.id,
    full_name: fullName,
    slug,
  });

  if (error) {
    redirect("/dashboard?error=" + encodeURIComponent(error.message));
  }

  revalidatePath("/dashboard");
  redirect("/dashboard");
}
