"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

type DocItem = { path: string; name: string; type: string; size: number };
type Result = { ok: true } | { error: string };

/** Record already-uploaded documents as media_assets (files go browser→Storage). */
export async function recordDocuments(input: {
  slug: string;
  legacyId: string;
  items: DocItem[];
}): Promise<Result> {
  const { slug, legacyId, items } = input;
  if (!legacyId || !items?.length) return { error: "Geen documenten ontvangen." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Je bent niet meer ingelogd." };

  const rows = items.map((it) => ({
    legacy_id: legacyId,
    kind: "document" as const,
    storage_path: it.path,
    file_name: it.name,
    caption: it.name,
    mime_type: it.type,
    size_bytes: it.size,
    uploaded_by_id: user.id,
  }));

  const { error } = await supabase.from("media_assets").insert(rows);
  if (error) {
    console.error("recordDocuments failed:", error.message);
    return { error: "Opslaan is niet gelukt." };
  }

  revalidatePath(`/legacy/${slug}/documenten`);
  return { ok: true };
}
