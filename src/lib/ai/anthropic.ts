import Anthropic from "@anthropic-ai/sdk";

/**
 * Anthropic client + the grounded "praat met een herinnering" helper.
 *
 * Core ethic: the AI is explicitly a memory built from what the person recorded.
 * It answers ONLY from the provided context and says so honestly when something
 * was never captured — it never invents and never pretends the person is alive.
 */

export const AI_MODELS = {
  chat: process.env.ANTHROPIC_MODEL ?? "claude-sonnet-5",
  deep: "claude-opus-4-8",
} as const;

let client: Anthropic | null = null;

export function isAiConfigured(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}

export function anthropic(): Anthropic {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error(
      "ANTHROPIC_API_KEY ontbreekt — de AI-laag is nog niet geconfigureerd.",
    );
  }
  client ??= new Anthropic({ apiKey });
  return client;
}

function systemPrompt(name: string): string {
  return [
    `Je bent een respectvolle digitale herinnering aan ${name}.`,
    `Je bent nadrukkelijk GEEN levend persoon en doet NOOIT alsof ${name} er nog is.`,
    "",
    "Regels:",
    `- Antwoord uitsluitend op basis van de meegeleverde herinneringen. Verzin niets.`,
    `- Staat iets niet in de context? Zeg dat eerlijk, bijvoorbeeld: "Dat heb ik niet vastgelegd."`,
    `- Spreek warm en in de eerste persoon zoals ${name} sprak, maar blijf duidelijk een herinnering — geen imitatie die pretendeert te leven.`,
    "- Schrijf in het Nederlands, kort en oprecht.",
  ].join("\n");
}

export type MemoryContext = { source: string; content: string }[];
export type ChatTurn = { role: "user" | "assistant"; content: string };

/** Ask the memory a question, grounded in retrieved context (RAG). */
export async function askMemory(opts: {
  name: string;
  question: string;
  context: MemoryContext;
  history?: ChatTurn[];
}): Promise<string> {
  const { name, question, context, history = [] } = opts;

  const contextBlock = context.length
    ? context.map((c, i) => `[${i + 1}] (${c.source})\n${c.content}`).join("\n\n")
    : "(geen vastgelegde herinneringen gevonden)";

  const message = await anthropic().messages.create({
    model: AI_MODELS.chat,
    max_tokens: 1024,
    system: systemPrompt(name),
    messages: [
      ...history,
      {
        role: "user",
        content: `Vastgelegde herinneringen:\n${contextBlock}\n\nVraag: ${question}`,
      },
    ],
  });

  const block = message.content.find((b) => b.type === "text");
  return block && "text" in block ? block.text : "";
}

/** The AI interviewer: propose ONE next question, building on the conversation. */
export async function nextInterviewQuestion(opts: {
  name: string;
  transcript: { question: string; answer: string }[];
}): Promise<string> {
  const { name, transcript } = opts;
  const convo =
    transcript.map((t) => `V: ${t.question}\nA: ${t.answer}`).join("\n\n") ||
    "(nog geen antwoorden)";

  const message = await anthropic().messages.create({
    model: AI_MODELS.chat,
    max_tokens: 200,
    system: [
      `Je bent een warme, nieuwsgierige interviewer die helpt om het levensverhaal van ${name} vast te leggen.`,
      "Stel telkens ÉÉN volgende vraag: kort, open en uitnodigend, voortbordurend op wat al is verteld.",
      "Vraag door naar gevoel, details en betekenis. Herhaal geen eerder gestelde vraag.",
      "Geef alleen de vraag zelf terug — geen inleiding, geen aanhalingstekens.",
    ].join("\n"),
    messages: [
      {
        role: "user",
        content: `Gesprek tot nu toe:\n${convo}\n\nStel de volgende vraag.`,
      },
    ],
  });

  const block = message.content.find((b) => b.type === "text");
  return block && "text" in block ? block.text.trim() : "";
}
