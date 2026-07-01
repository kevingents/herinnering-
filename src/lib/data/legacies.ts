import { createClient } from "@/lib/supabase/server";

export type LegacyRow = {
  id: string;
  slug: string;
  full_name: string;
  status: string;
  headline: string | null;
  birth_date: string | null;
  death_date: string | null;
};

/** Legacies the current user can access (RLS-scoped via the Supabase client). */
export async function getMyLegacies(): Promise<LegacyRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("legacies")
    .select("id, slug, full_name, status, headline, birth_date, death_date")
    .order("created_at", { ascending: true });

  if (error) throw new Error(error.message);
  return (data ?? []) as LegacyRow[];
}
