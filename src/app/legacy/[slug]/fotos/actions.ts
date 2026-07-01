"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

type PhotoItem = { path: string; name: string; type: string; size: number };
type Result = { ok: true } | { error: string };

/**
 * Record already-uploaded photos as media_assets. Files are uploaded directly
 * from the browser to Storage (RLS-enforced); this only writes the rows.
 */
export async function recordPhotos(input: {
  slug: string;
  legacyId: string;
  caption: string | null;
  takenAt: string | null;
  items: PhotoItem[];
}): Promise<Result> {
  const { slug, legacyId, caption, takenAt, items } = input;
  if (!legacyId || !items?.length) return { error: "Geen foto's ontvangen." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Je bent niet meer ingelogd." };

  const rows = items.map((it) => ({
    legacy_id: legacyId,
    kind: "image" as const,
    storage_path: it.path,
    file_name: it.name,
    mime_type: it.type,
    size_bytes: it.size,
    caption,
    uploaded_by_id: user.id,
    metadata: takenAt ? { taken_at: takenAt } : null,
  }));

  const { error } = await supabase.from("media_assets").insert(rows);
  if (error) return { error: error.message };

  revalidatePath(`/legacy/${slug}/fotos`);
  return { ok: true };
}
