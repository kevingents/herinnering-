import { createClient } from "@/lib/supabase/server";

export type Legacy = {
  id: string;
  slug: string;
  full_name: string;
  status: string;
  headline: string | null;
  biography: string | null;
  birth_date: string | null;
  death_date: string | null;
};

export type LifeEvent = {
  id: string;
  category: string;
  title: string;
  description: string | null;
  event_date: string | null;
  end_date: string | null;
  date_precision: string;
  location_name: string | null;
};

/** A single legacy by slug (RLS ensures the user may see it), or null. */
export async function getLegacyBySlug(slug: string): Promise<Legacy | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("legacies")
    .select("id, slug, full_name, status, headline, biography, birth_date, death_date")
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return (data as Legacy | null) ?? null;
}

/** Whether the current user may edit this legacy (owner or active editor). */
export async function canEditLegacy(legacyId: string): Promise<boolean> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("can_edit_legacy", {
    p_legacy: legacyId,
  });
  if (error) return false;
  return Boolean(data);
}

/** Whether the current user owns this legacy (only owners manage access). */
export async function isLegacyOwner(legacyId: string): Promise<boolean> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("is_legacy_owner", {
    p_legacy: legacyId,
  });
  if (error) return false;
  return Boolean(data);
}

/** Timeline milestones for a legacy, oldest first. */
export async function getLifeEvents(legacyId: string): Promise<LifeEvent[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("life_events")
    .select("id, category, title, description, event_date, end_date, date_precision, location_name")
    .eq("legacy_id", legacyId)
    .order("event_date", { ascending: true, nullsFirst: false });

  if (error) throw new Error(error.message);
  return (data ?? []) as LifeEvent[];
}
