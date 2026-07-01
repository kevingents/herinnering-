import { createClient } from "@/lib/supabase/server";

export type GalleryItem = {
  id: string;
  kind: "image" | "video";
  caption: string | null;
  created_at: string;
  takenAt: string | null;
  mimeType: string | null;
  url: string | null;
};

/** Photos and videos for a legacy, newest first, with signed URLs. */
export async function getGallery(legacyId: string): Promise<GalleryItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("media_assets")
    .select("id, kind, caption, storage_path, mime_type, metadata, created_at")
    .eq("legacy_id", legacyId)
    .in("kind", ["image", "video"])
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  const rows = (data ?? []) as {
    id: string;
    kind: "image" | "video";
    caption: string | null;
    storage_path: string;
    mime_type: string | null;
    metadata: { taken_at?: string } | null;
    created_at: string;
  }[];
  if (rows.length === 0) return [];

  const { data: signed } = await supabase.storage
    .from("media")
    .createSignedUrls(
      rows.map((r) => r.storage_path),
      3600,
    );
  const urlByPath = new Map(
    (signed ?? []).map((s) => [s.path, s.signedUrl] as const),
  );

  return rows.map((r) => ({
    id: r.id,
    kind: r.kind,
    caption: r.caption,
    created_at: r.created_at,
    takenAt: r.metadata?.taken_at ?? null,
    mimeType: r.mime_type,
    url: urlByPath.get(r.storage_path) ?? null,
  }));
}
