"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

type Result = { ok: true } | { error: string };

function extFor(mime: string): string {
  if (mime.includes("mp4") || mime.includes("m4a")) return "mp4";
  if (mime.includes("ogg")) return "ogg";
  if (mime.includes("mpeg") || mime.includes("mp3")) return "mp3";
  return "webm";
}

/** Upload a recording to Storage and record media_assets + voice_samples. */
export async function saveVoiceSample(formData: FormData): Promise<Result> {
  const slug = String(formData.get("slug") ?? "");
  const legacyId = String(formData.get("legacyId") ?? "");
  const emotion = String(formData.get("emotion") ?? "rustig");
  const duration = Math.round(Number(formData.get("duration") ?? 0)) || null;
  const file = formData.get("audio");

  if (!(file instanceof File) || file.size === 0 || !legacyId) {
    return { error: "Geen opname ontvangen." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Je bent niet meer ingelogd." };

  const mime = file.type || "audio/webm";
  const path = `${legacyId}/voice/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${extFor(mime)}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error: upErr } = await supabase.storage
    .from("media")
    .upload(path, buffer, { contentType: mime, upsert: false });
  if (upErr) return { error: upErr.message };

  const { data: media, error: mErr } = await supabase
    .from("media_assets")
    .insert({
      legacy_id: legacyId,
      kind: "audio",
      storage_path: path,
      file_name: path.split("/").pop(),
      mime_type: mime,
      size_bytes: file.size,
      duration_seconds: duration,
      uploaded_by_id: user.id,
    })
    .select("id")
    .single();
  if (mErr) {
    await supabase.storage.from("media").remove([path]);
    return { error: mErr.message };
  }

  const { error: vErr } = await supabase.from("voice_samples").insert({
    legacy_id: legacyId,
    media_id: media.id,
    emotion,
    is_training: true,
  });
  if (vErr) return { error: vErr.message };

  revalidatePath(`/legacy/${slug}/stem`);
  return { ok: true };
}
