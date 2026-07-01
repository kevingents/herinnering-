import { createClient } from "@/lib/supabase/server";
import type { Persona } from "@/lib/ai/anthropic";

export type Personality = {
  summary: string | null;
  tone: string | null;
  humor: string | null;
  values: string[];
  traits: string[];
  favoritePhrases: string[];
  philosophy: string | null;
  trainingCompleteness: number;
};

type Row = {
  summary: string | null;
  tone: string | null;
  humor: string | null;
  values: unknown;
  traits: unknown;
  favorite_phrases: unknown;
  philosophy: string | null;
  training_completeness: number | null;
};

function arr(v: unknown): string[] {
  return Array.isArray(v)
    ? v.filter((x): x is string => typeof x === "string")
    : [];
}

/** The digital personality profile for a legacy, or null if none yet. */
export async function getPersonality(
  legacyId: string,
): Promise<Personality | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("personality_profiles")
    .select(
      "summary, tone, humor, values, traits, favorite_phrases, philosophy, training_completeness",
    )
    .eq("legacy_id", legacyId)
    .maybeSingle();

  if (error) throw new Error(error.message);
  const row = (data as Row | null) ?? null;
  if (!row) return null;

  return {
    summary: row.summary,
    tone: row.tone,
    humor: row.humor,
    values: arr(row.values),
    traits: arr(row.traits),
    favoritePhrases: arr(row.favorite_phrases),
    philosophy: row.philosophy,
    trainingCompleteness: row.training_completeness ?? 0,
  };
}

/** Just the fields that colour the AI's tone (for askMemory). Never throws. */
export async function getPersona(legacyId: string): Promise<Persona | null> {
  try {
    const p = await getPersonality(legacyId);
    if (!p) return null;
    return {
      tone: p.tone,
      humor: p.humor,
      values: p.values,
      favoritePhrases: p.favoritePhrases,
    };
  } catch {
    return null;
  }
}
