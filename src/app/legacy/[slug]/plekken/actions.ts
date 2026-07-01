"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

type CoverItem = {
  path: string;
  name: string;
  type: string;
  size: number;
} | null;

type Result = { ok: true } | { error: string };

/**
 * Add a memory pinned to a place. The (optional) cover photo is uploaded from
 * the browser to Storage first; here we only write the rows. RLS enforces that
 * the current user may edit this legacy.
 */
export async function addPlace(input: {
  slug: string;
  legacyId: string;
  title: string;
  body: string | null;
  memoryDate: string | null;
  locationName: string;
  latitude: number;
  longitude: number;
  cover: CoverItem;
}): Promise<Result> {
  const {
    slug,
    legacyId,
    title,
    body,
    memoryDate,
    locationName,
    latitude,
    longitude,
    cover,
  } = input;

  if (!legacyId) return { error: "Onbekende nalatenschap." };
  if (!title.trim()) return { error: "Geef de herinnering een titel." };
  if (
    typeof latitude !== "number" ||
    typeof longitude !== "number" ||
    Number.isNaN(latitude) ||
    Number.isNaN(longitude)
  ) {
    return { error: "Kies eerst een plek." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Je bent niet meer ingelogd." };

  let coverMediaId: string | null = null;
  if (cover) {
    const { data: media, error: mErr } = await supabase
      .from("media_assets")
      .insert({
        legacy_id: legacyId,
        kind: "image" as const,
        storage_path: cover.path,
        file_name: cover.name,
        mime_type: cover.type,
        size_bytes: cover.size,
        uploaded_by_id: user.id,
      })
      .select("id")
      .single();
    if (mErr) return { error: mErr.message };
    coverMediaId = (media as { id: string } | null)?.id ?? null;
  }

  const { error } = await supabase.from("memories").insert({
    legacy_id: legacyId,
    author_id: user.id,
    type: "story" as const,
    title: title.trim(),
    body: body?.trim() || null,
    memory_date: memoryDate || null,
    location_name: locationName.trim() || null,
    latitude,
    longitude,
    cover_media_id: coverMediaId,
  });
  if (error) return { error: error.message };

  revalidatePath(`/legacy/${slug}/plekken`);
  return { ok: true };
}

/** Remove a place (the memory). RLS enforces edit rights. */
export async function deletePlace(input: {
  slug: string;
  id: string;
}): Promise<Result> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Je bent niet meer ingelogd." };

  const { error } = await supabase.from("memories").delete().eq("id", input.id);
  if (error) return { error: error.message };

  revalidatePath(`/legacy/${input.slug}/plekken`);
  return { ok: true };
}
