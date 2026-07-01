"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { isAiConfigured, nextInterviewQuestion } from "@/lib/ai/anthropic";

const FALLBACK_QUESTION =
  "Wat wil je nog vertellen dat we tot nu toe niet hebben besproken?";

async function pickNextQuestion(
  supabase: SupabaseClient,
  legacyId: string,
  name: string,
): Promise<{ questionText: string; questionId: string | null }> {
  const { data: rows } = await supabase
    .from("interview_answers")
    .select("question_text, answer_text, question_id")
    .eq("legacy_id", legacyId)
    .order("created_at", { ascending: true });

  const all = (rows ?? []) as {
    question_text: string;
    answer_text: string | null;
    question_id: string | null;
  }[];
  const answered = all.filter((r) => r.answer_text != null);

  // AI interviewer (falls back to seeds on any failure).
  if (isAiConfigured()) {
    try {
      const q = await nextInterviewQuestion({
        name,
        transcript: answered.map((r) => ({
          question: r.question_text,
          answer: r.answer_text as string,
        })),
      });
      if (q) return { questionText: q, questionId: null };
    } catch {
      // fall through to the seed bank
    }
  }

  const usedIds = new Set(
    all.map((r) => r.question_id).filter((id): id is string => Boolean(id)),
  );
  const { data: seeds } = await supabase
    .from("interview_questions")
    .select("id, text")
    .eq("is_seed", true)
    .order("created_at", { ascending: true });

  const next = ((seeds ?? []) as { id: string; text: string }[]).find(
    (s) => !usedIds.has(s.id),
  );
  if (next) return { questionText: next.text, questionId: next.id };

  return { questionText: FALLBACK_QUESTION, questionId: null };
}

/** Ensure exactly one open question exists (create the next one if needed). */
async function ensurePending(
  supabase: SupabaseClient,
  legacyId: string,
  name: string,
) {
  const { data: open } = await supabase
    .from("interview_answers")
    .select("id")
    .eq("legacy_id", legacyId)
    .is("answer_text", null)
    .limit(1);

  if (open && open.length > 0) return;

  const { questionText, questionId } = await pickNextQuestion(
    supabase,
    legacyId,
    name,
  );
  await supabase.from("interview_answers").insert({
    legacy_id: legacyId,
    question_text: questionText,
    question_id: questionId,
  });
}

/** Start the interview or fetch the next question. */
export async function startOrAdvance(formData: FormData) {
  const slug = String(formData.get("slug") ?? "");
  const legacyId = String(formData.get("legacyId") ?? "");
  const name = String(formData.get("name") ?? "");

  const supabase = await createClient();
  await ensurePending(supabase, legacyId, name);
  revalidatePath(`/legacy/${slug}/interview`);
  redirect(`/legacy/${slug}/interview`);
}

/** Save the answer to the open question, then queue the next one. */
export async function answerQuestion(formData: FormData) {
  const slug = String(formData.get("slug") ?? "");
  const legacyId = String(formData.get("legacyId") ?? "");
  const name = String(formData.get("name") ?? "");
  const pendingId = String(formData.get("pendingId") ?? "");
  const answerText = String(formData.get("answerText") ?? "").trim();
  const back = `/legacy/${slug}/interview`;

  if (!answerText || !pendingId) redirect(back);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase
    .from("interview_answers")
    .update({ answer_text: answerText, answered_by_id: user?.id ?? null })
    .eq("id", pendingId)
    .is("answer_text", null);

  if (error) redirect(`${back}?error=${encodeURIComponent(error.message)}`);

  await ensurePending(supabase, legacyId, name);
  revalidatePath(back);
  redirect(back);
}
