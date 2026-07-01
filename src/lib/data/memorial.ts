import { createServiceClient } from "@/lib/supabase/admin";

export type Memorial = {
  legacyId: string;
  slug: string;
  full_name: string;
  headline: string | null;
  biography: string | null;
  birth_date: string | null;
  death_date: string | null;
};

export type MemorialEvent = {
  title: string;
  description: string | null;
  event_date: string | null;
  category: string;
};

/** Resolve a QR/NFC code to a memorial. Only active markers are public. */
export async function getMemorialByCode(code: string): Promise<Memorial | null> {
  const svc = createServiceClient();

  const { data: marker } = await svc
    .from("grave_markers")
    .select("legacy_id, is_active")
    .eq("code", code)
    .maybeSingle();

  const m = marker as { legacy_id: string; is_active: boolean } | null;
  if (!m || !m.is_active) return null;

  const { data: legacy } = await svc
    .from("legacies")
    .select("id, slug, full_name, headline, biography, birth_date, death_date")
    .eq("id", m.legacy_id)
    .maybeSingle();

  const l = legacy as
    | (Omit<Memorial, "legacyId"> & { id: string })
    | null;
  if (!l) return null;

  return {
    legacyId: l.id,
    slug: l.slug,
    full_name: l.full_name,
    headline: l.headline,
    biography: l.biography,
    birth_date: l.birth_date,
    death_date: l.death_date,
  };
}

/** A short glimpse of the life, for the memorial page. */
export async function getMemorialEvents(legacyId: string): Promise<MemorialEvent[]> {
  const svc = createServiceClient();
  const { data } = await svc
    .from("life_events")
    .select("title, description, event_date, category")
    .eq("legacy_id", legacyId)
    .order("event_date", { ascending: true })
    .limit(12);
  return (data ?? []) as MemorialEvent[];
}

/** Record a scan (fire-and-forget). Counter races are acceptable. */
export async function registerScan(code: string): Promise<void> {
  const svc = createServiceClient();
  const { data } = await svc
    .from("grave_markers")
    .select("id, scan_count")
    .eq("code", code)
    .maybeSingle();
  const marker = data as { id: string; scan_count: number } | null;
  if (!marker) return;
  await svc
    .from("grave_markers")
    .update({
      scan_count: (marker.scan_count ?? 0) + 1,
      last_scanned_at: new Date().toISOString(),
    })
    .eq("id", marker.id);
}

const CLIP = 800;

/** Everything the person recorded, as grounding context for the AI (RAG). */
export async function getMemorialContext(
  legacyId: string,
): Promise<{ source: string; content: string }[]> {
  const svc = createServiceClient();
  const ctx: { source: string; content: string }[] = [];

  const { data: events } = await svc
    .from("life_events")
    .select("title, description, event_date")
    .eq("legacy_id", legacyId)
    .order("event_date", { ascending: true })
    .limit(40);
  for (const e of (events ?? []) as {
    title: string;
    description: string | null;
    event_date: string | null;
  }[]) {
    ctx.push({
      source: `Gebeurtenis: ${e.title}`,
      content: [e.event_date, e.title, e.description]
        .filter(Boolean)
        .join(" — ")
        .slice(0, CLIP),
    });
  }

  const { data: mems } = await svc
    .from("memories")
    .select("title, body")
    .eq("legacy_id", legacyId)
    .limit(40);
  for (const m of (mems ?? []) as { title: string | null; body: string | null }[]) {
    const content = [m.title, m.body].filter(Boolean).join(": ").slice(0, CLIP);
    if (content) ctx.push({ source: `Herinnering: ${m.title ?? ""}`, content });
  }

  const { data: answers } = await svc
    .from("interview_answers")
    .select("question_text, answer_text")
    .eq("legacy_id", legacyId)
    .not("answer_text", "is", null)
    .limit(60);
  for (const a of (answers ?? []) as {
    question_text: string;
    answer_text: string;
  }[]) {
    ctx.push({
      source: "Interview",
      content: `V: ${a.question_text}\nA: ${a.answer_text}`.slice(0, CLIP),
    });
  }

  const { data: voices } = await svc
    .from("voice_samples")
    .select("transcript, emotion")
    .eq("legacy_id", legacyId)
    .not("transcript", "is", null)
    .limit(20);
  for (const v of (voices ?? []) as { transcript: string; emotion: string }[]) {
    ctx.push({ source: `Opname (${v.emotion})`, content: v.transcript.slice(0, CLIP) });
  }

  return ctx;
}
