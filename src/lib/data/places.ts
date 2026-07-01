import { createClient } from "@/lib/supabase/server";

/** A memory that is pinned to a place on the map. */
export type Place = {
  id: string;
  title: string | null;
  body: string | null;
  memoryDate: string | null;
  locationName: string | null;
  latitude: number;
  longitude: number;
  coverUrl: string | null;
  createdAt: string;
};

type Row = {
  id: string;
  title: string | null;
  body: string | null;
  memory_date: string | null;
  location_name: string | null;
  latitude: number;
  longitude: number;
  cover_media_id: string | null;
  created_at: string;
};

/**
 * Memories with coordinates for a legacy, oldest first, with short-lived
 * signed URLs for their cover photo. RLS ensures the user may see them.
 */
export async function getPlaces(legacyId: string): Promise<Place[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("memories")
    .select(
      "id, title, body, memory_date, location_name, latitude, longitude, cover_media_id, created_at",
    )
    .eq("legacy_id", legacyId)
    .not("latitude", "is", null)
    .not("longitude", "is", null)
    .order("memory_date", { ascending: true, nullsFirst: false });

  if (error) throw new Error(error.message);
  const rows = (data ?? []) as Row[];
  if (rows.length === 0) return [];

  // Resolve signed URLs for the cover photos, if any.
  const coverIds = [
    ...new Set(rows.map((r) => r.cover_media_id).filter(Boolean) as string[]),
  ];
  const urlByMediaId = new Map<string, string>();
  if (coverIds.length > 0) {
    const { data: media } = await supabase
      .from("media_assets")
      .select("id, storage_path")
      .in("id", coverIds);
    const rowsMedia = (media ?? []) as { id: string; storage_path: string }[];
    if (rowsMedia.length > 0) {
      const { data: signed } = await supabase.storage
        .from("media")
        .createSignedUrls(
          rowsMedia.map((m) => m.storage_path),
          3600,
        );
      const signedByPath = new Map(
        (signed ?? []).map((s) => [s.path, s.signedUrl] as const),
      );
      for (const m of rowsMedia) {
        const url = signedByPath.get(m.storage_path);
        if (url) urlByMediaId.set(m.id, url);
      }
    }
  }

  return rows.map((r) => ({
    id: r.id,
    title: r.title,
    body: r.body,
    memoryDate: r.memory_date,
    locationName: r.location_name,
    latitude: r.latitude,
    longitude: r.longitude,
    coverUrl: r.cover_media_id
      ? (urlByMediaId.get(r.cover_media_id) ?? null)
      : null,
    createdAt: r.created_at,
  }));
}
