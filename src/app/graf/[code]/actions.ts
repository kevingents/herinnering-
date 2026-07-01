"use server";

import {
  getMemorialByCode,
  getMemorialContext,
  getMemorialPersona,
} from "@/lib/data/memorial";
import { askMemory, isAiConfigured } from "@/lib/ai/anthropic";

export type ChatTurn = { role: "user" | "assistant"; content: string };
type AskResult = { answer: string } | { error: string };

/** Public: ask a memorial a question. Only works for an active marker code. */
export async function askMemorial(
  code: string,
  question: string,
  history: ChatTurn[],
): Promise<AskResult> {
  const q = question.trim().slice(0, 500);
  if (!q) return { error: "Stel een vraag." };

  const memorial = await getMemorialByCode(code);
  if (!memorial) return { error: "Deze gedenkplek is niet (meer) beschikbaar." };

  if (!isAiConfigured()) {
    return {
      answer:
        "De herinnering is nog niet volledig geactiveerd. Kom later nog eens terug.",
    };
  }

  const [context, persona] = await Promise.all([
    getMemorialContext(memorial.legacyId),
    getMemorialPersona(memorial.legacyId),
  ]);
  const safeHistory = Array.isArray(history) ? history.slice(-6) : [];

  try {
    const answer = await askMemory({
      name: memorial.full_name,
      question: q,
      context,
      history: safeHistory,
      persona,
    });
    return { answer: answer || "Daar heb ik geen herinnering aan." };
  } catch {
    return { error: "Er ging iets mis. Probeer het zo nog eens." };
  }
}
