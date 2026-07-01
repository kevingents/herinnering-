import { createClient } from "@/lib/supabase/server";

export type DocumentItem = {
  id: string;
  title: string;
  fileName: string | null;
  mime: string | null;
  url: string | null;
  created_at: string;
};

/** Document media for a legacy, newest first, with short-lived signed URLs. */
export async function getDocuments(legacyId: string): Promise<DocumentItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("media_assets")
    .select("id, caption, file_name, mime_type, storage_path, created_at")
    .eq("legacy_id", legacyId)
    .eq("kind", "document")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  const rows = (data ?? []) as {
    id: string;
    caption: string | null;
    file_name: string | null;
    mime_type: string | null;
    storage_path: string;
    created_at: string;
  }[];
  if (rows.length === 0) return [];

  const { data: signed } = await supabase.storage
    .from("media")
    .createSignedUrls(rows.map((r) => r.storage_path), 3600);
  const byPath = new Map((signed ?? []).map((s) => [s.path, s.signedUrl] as const));

  return rows.map((r) => ({
    id: r.id,
    title: r.caption || r.file_name || "Document",
    fileName: r.file_name,
    mime: r.mime_type,
    url: byPath.get(r.storage_path) ?? null,
    created_at: r.created_at,
  }));
}
