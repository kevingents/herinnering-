import { createClient } from "@/lib/supabase/server";

export type TimeCapsule = {
  id: string;
  title: string;
  message: string | null;
  trigger: string;
  unlock_date: string | null;
  unlock_condition: string | null;
  years_after: number | null;
  recipient_email: string | null;
  is_unlocked: boolean;
  created_at: string;
};

export async function getTimeCapsules(legacyId: string): Promise<TimeCapsule[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("time_capsules")
    .select(
      "id, title, message, trigger, unlock_date, unlock_condition, years_after, recipient_email, is_unlocked, created_at",
    )
    .eq("legacy_id", legacyId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []) as TimeCapsule[];
}
