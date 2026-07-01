"use server";

import { createClient } from "@/lib/supabase/server";
import { getMemorialContext } from "@/lib/data/memorial";
import { getPersona } from "@/lib/data/personality";
import { askMemory, isAiConfigured } from "@/lib/ai/anthropic";

export type ChatTurn = { role: "user" | "assistant"; content: string };
type AskResult = { answer: string } | { error: string };

/** Ask a legacy a question — for logged-in users with access to that legacy. */
export async function askInApp(
  legacyId: string,
  question: string,
  history: ChatTurn[],
): Promise<AskResult> {
  const q = question.trim().slice(0, 500);
  if (!q) return { error: "Stel een vraag." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Log in om te chatten." };

  // RLS returns the row only if the user may access this legacy.
  const { data: legacy } = await supabase
    .from("legacies")
    .select("id, full_name")
    .eq("id", legacyId)
    .maybeSingle();
  const l = legacy as { id: string; full_name: string } | null;
  if (!l) return { error: "Geen toegang tot deze nalatenschap." };

  if (!isAiConfigured()) {
    return { answer: "De AI-herinnering is nog niet geconfigureerd." };
  }

  const [context, persona] = await Promise.all([
    getMemorialContext(l.id),
    getPersona(l.id),
  ]);
  try {
    const answer = await askMemory({
      name: l.full_name,
      question: q,
      context,
      history: Array.isArray(history) ? history.slice(-6) : [],
      persona,
    });
    return { answer: answer || "Daar heb ik geen herinnering aan." };
  } catch {
    return { error: "Er ging iets mis. Probeer het zo nog eens." };
  }
}
