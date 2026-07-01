"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getMemorialContext } from "@/lib/data/memorial";
import { analysePersonality, isAiConfigured } from "@/lib/ai/anthropic";

type Result = { ok: true } | { error: string };

export type PersonaFields = {
  summary: string;
  tone: string;
  humor: string;
  philosophy: string;
  values: string[];
  traits: string[];
  favoritePhrases: string[];
};

type GenerateResult = { ok: true; draft: PersonaFields } | { error: string };

export type PersonalityInput = {
  slug: string;
  legacyId: string;
  summary: string;
  tone: string;
  humor: string;
  philosophy: string;
  values: string[];
  traits: string[];
  favoritePhrases: string[];
};

function completeness(p: {
  summary: string;
  tone: string;
  humor: string;
  philosophy: string;
  values: string[];
  traits: string[];
  favoritePhrases: string[];
}): number {
  const buckets = [
    p.summary.trim() !== "",
    p.tone.trim() !== "",
    p.humor.trim() !== "",
    p.philosophy.trim() !== "",
    p.values.length > 0,
    p.traits.length > 0,
    p.favoritePhrases.length > 0,
  ];
  const filled = buckets.filter(Boolean).length;
  return Math.round((filled / buckets.length) * 100);
}

function clean(list: string[]): string[] {
  return [...new Set(list.map((s) => s.trim()).filter(Boolean))].slice(0, 20);
}

/** Save the personality profile (upsert). RLS enforces edit rights. */
export async function savePersonality(input: PersonalityInput): Promise<Result> {
  const { slug, legacyId } = input;
  if (!legacyId) return { error: "Onbekende nalatenschap." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Je bent niet meer ingelogd." };

  const values = clean(input.values);
  const traits = clean(input.traits);
  const favoritePhrases = clean(input.favoritePhrases);

  const payload = {
    legacy_id: legacyId,
    summary: input.summary.trim() || null,
    tone: input.tone.trim() || null,
    humor: input.humor.trim() || null,
    philosophy: input.philosophy.trim() || null,
    values,
    traits,
    favorite_phrases: favoritePhrases,
    training_completeness: completeness({
      summary: input.summary,
      tone: input.tone,
      humor: input.humor,
      philosophy: input.philosophy,
      values,
      traits,
      favoritePhrases,
    }),
  };

  const { error } = await supabase
    .from("personality_profiles")
    .upsert(payload, { onConflict: "legacy_id" });
  if (error) return { error: error.message };

  revalidatePath(`/legacy/${slug}/persoonlijkheid`);
  return { ok: true };
}

/**
 * Generate a personality draft from everything the person recorded, then save
 * it. Honest by construction: it only infers what the material supports.
 */
export async function generatePersonality(input: {
  slug: string;
  legacyId: string;
}): Promise<GenerateResult> {
  const { slug, legacyId } = input;
  if (!legacyId) return { error: "Onbekende nalatenschap." };
  if (!isAiConfigured()) return { error: "De AI-laag is nog niet geconfigureerd." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Je bent niet meer ingelogd." };

  // RLS check: only proceed if the user may edit this legacy.
  const { data: canEdit } = await supabase.rpc("can_edit_legacy", {
    p_legacy: legacyId,
  });
  if (!canEdit) return { error: "Je mag deze nalatenschap niet bewerken." };

  const { data: legacy } = await supabase
    .from("legacies")
    .select("full_name")
    .eq("id", legacyId)
    .maybeSingle();
  const name = (legacy as { full_name: string } | null)?.full_name;
  if (!name) return { error: "Nalatenschap niet gevonden." };

  const context = await getMemorialContext(legacyId);
  if (context.length === 0) {
    return {
      error:
        "Er is nog te weinig vastgelegd om een persoonlijkheid te kunnen afleiden. Voeg eerst herinneringen of interviews toe.",
    };
  }

  let draft;
  try {
    draft = await analysePersonality({ name, context });
  } catch {
    return { error: "Analyse mislukte. Probeer het zo nog eens." };
  }

  const saved = await savePersonality({
    slug,
    legacyId,
    summary: draft.summary,
    tone: draft.tone,
    humor: draft.humor,
    philosophy: draft.philosophy,
    values: draft.values,
    traits: draft.traits,
    favoritePhrases: draft.favoritePhrases,
  });
  if ("error" in saved) return saved;

  return {
    ok: true,
    draft: {
      summary: draft.summary,
      tone: draft.tone,
      humor: draft.humor,
      philosophy: draft.philosophy,
      values: draft.values,
      traits: draft.traits,
      favoritePhrases: draft.favoritePhrases,
    },
  };
}
