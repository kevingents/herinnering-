import { createClient } from "@/lib/supabase/server";

export type Photo = {
  id: string;
  caption: string | null;
  created_at: string;
  takenAt: string | null;
  url: string | null;
};

/** Image media for a legacy, newest first, with short-lived signed URLs. */
export async function getPhotos(legacyId: string): Promise<Photo[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("media_assets")
    .select("id, caption, storage_path, metadata, created_at")
    .eq("legacy_id", legacyId)
    .eq("kind", "image")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  const rows = (data ?? []) as {
    id: string;
    caption: string | null;
    storage_path: string;
    metadata: { taken_at?: string } | null;
    created_at: string;
  }[];
  if (rows.length === 0) return [];

  const { data: signed } = await supabase.storage
    .from("media")
    .createSignedUrls(rows.map((r) => r.storage_path), 3600);

  const urlByPath = new Map(
    (signed ?? []).map((s) => [s.path, s.signedUrl] as const),
  );

  return rows.map((r) => ({
    id: r.id,
    caption: r.caption,
    created_at: r.created_at,
    takenAt: r.metadata?.taken_at ?? null,
    url: urlByPath.get(r.storage_path) ?? null,
  }));
}
