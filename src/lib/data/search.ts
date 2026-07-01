import { createClient } from "@/lib/supabase/server";

export type SearchResults = {
  memories: { id: string; title: string | null; body: string | null }[];
  events: { id: string; title: string; description: string | null }[];
  people: { id: string; name: string; relation: string | null }[];
  answers: { id: string; question_text: string; answer_text: string | null }[];
  documents: { id: string; caption: string | null; file_name: string | null }[];
  total: number;
};

const empty: SearchResults = {
  memories: [],
  events: [],
  people: [],
  answers: [],
  documents: [],
  total: 0,
};

/** Full-text-ish search across a legacy's content (RLS-scoped). */
export async function searchLegacy(
  legacyId: string,
  query: string,
): Promise<SearchResults> {
  // Sanitise for PostgREST .or() / .ilike() (strip filter-control chars).
  const term = query.replace(/[%,()*]/g, " ").trim().slice(0, 60);
  if (!term) return empty;
  const like = `%${term}%`;
  const supabase = await createClient();

  const [mem, ev, pe, an, doc] = await Promise.all([
    supabase
      .from("memories")
      .select("id, title, body")
      .eq("legacy_id", legacyId)
      .or(`title.ilike.${like},body.ilike.${like}`)
      .limit(20),
    supabase
      .from("life_events")
      .select("id, title, description")
      .eq("legacy_id", legacyId)
      .or(`title.ilike.${like},description.ilike.${like}`)
      .limit(20),
    supabase
      .from("people")
      .select("id, name, relation")
      .eq("legacy_id", legacyId)
      .ilike("name", like)
      .limit(20),
    supabase
      .from("interview_answers")
      .select("id, question_text, answer_text")
      .eq("legacy_id", legacyId)
      .not("answer_text", "is", null)
      .ilike("answer_text", like)
      .limit(20),
    supabase
      .from("media_assets")
      .select("id, caption, file_name")
      .eq("legacy_id", legacyId)
      .eq("kind", "document")
      .or(`caption.ilike.${like},file_name.ilike.${like}`)
      .limit(20),
  ]);

  const memories = (mem.data ?? []) as SearchResults["memories"];
  const events = (ev.data ?? []) as SearchResults["events"];
  const people = (pe.data ?? []) as SearchResults["people"];
  const answers = (an.data ?? []) as SearchResults["answers"];
  const documents = (doc.data ?? []) as SearchResults["documents"];

  return {
    memories,
    events,
    people,
    answers,
    documents,
    total:
      memories.length +
      events.length +
      people.length +
      answers.length +
      documents.length,
  };
}
