import { createClient } from "@/lib/supabase/server";

export type VoiceSample = {
  id: string;
  emotion: string;
  created_at: string;
  transcript: string | null;
  url: string | null;
  duration: number | null;
};

/** Voice samples for a legacy, newest first, with short-lived signed URLs. */
export async function getVoiceSamples(legacyId: string): Promise<VoiceSample[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("voice_samples")
    .select("id, emotion, transcript, created_at, media:media_assets(storage_path, duration_seconds)")
    .eq("legacy_id", legacyId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  const rows = (data ?? []) as unknown as {
    id: string;
    emotion: string;
    transcript: string | null;
    created_at: string;
    media:
      | { storage_path: string; duration_seconds: number | null }
      | { storage_path: string; duration_seconds: number | null }[]
      | null;
  }[];

  const samples: VoiceSample[] = [];
  for (const r of rows) {
    const media = Array.isArray(r.media) ? r.media[0] : r.media;
    let url: string | null = null;
    if (media?.storage_path) {
      const { data: signed } = await supabase.storage
        .from("media")
        .createSignedUrl(media.storage_path, 3600);
      url = signed?.signedUrl ?? null;
    }
    samples.push({
      id: r.id,
      emotion: r.emotion,
      created_at: r.created_at,
      transcript: r.transcript,
      url,
      duration: media?.duration_seconds ?? null,
    });
  }
  return samples;
}
