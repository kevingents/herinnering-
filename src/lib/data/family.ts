import { createClient } from "@/lib/supabase/server";

export type Person = {
  id: string;
  name: string;
  relation: string | null;
  notes: string | null;
};

/** People in a legacy's life, for the family tree. */
export async function getFamily(legacyId: string): Promise<Person[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("people")
    .select("id, name, relation, notes")
    .eq("legacy_id", legacyId)
    .order("created_at", { ascending: true });

  if (error) throw new Error(error.message);
  return (data ?? []) as Person[];
}
