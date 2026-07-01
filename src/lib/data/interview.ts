import { createClient } from "@/lib/supabase/server";

export type InterviewEntry = {
  id: string;
  question_text: string;
  answer_text: string | null;
  question_id: string | null;
};

/**
 * The interview state for a legacy: answered Q&A (the transcript) plus the one
 * open question awaiting an answer (answer_text IS NULL), if any.
 */
export async function getInterviewState(legacyId: string): Promise<{
  answered: InterviewEntry[];
  pending: InterviewEntry | null;
}> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("interview_answers")
    .select("id, question_text, answer_text, question_id, created_at")
    .eq("legacy_id", legacyId)
    .order("created_at", { ascending: true });

  if (error) throw new Error(error.message);

  const rows = (data ?? []) as (InterviewEntry & { created_at: string })[];
  return {
    answered: rows.filter((r) => r.answer_text != null),
    pending: rows.find((r) => r.answer_text == null) ?? null,
  };
}
