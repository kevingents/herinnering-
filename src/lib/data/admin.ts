import { createServiceClient } from "@/lib/supabase/admin";

export type AdminLegacy = {
  id: string;
  slug: string;
  full_name: string;
  status: string;
  created_at: string;
  owner_email: string | null;
};

export type AdminLead = {
  id: string;
  organization: string | null;
  name: string;
  email: string;
  phone: string | null;
  message: string | null;
  created_at: string;
};

export type AdminOverview = {
  counts: {
    legacies: number;
    users: number;
    members: number;
    markers: number;
  };
  subscriptions: { plan: string; count: number }[];
  privacyPending: number;
  recentLegacies: AdminLegacy[];
  partnerLeads: AdminLead[];
};

/** Platform-wide overview. Callers MUST verify admin first (service client). */
export async function getAdminOverview(): Promise<AdminOverview> {
  const svc = createServiceClient();

  const [legaciesC, usersC, membersC, markersC, privacyC] = await Promise.all([
    svc.from("legacies").select("*", { count: "exact", head: true }),
    svc.from("profiles").select("*", { count: "exact", head: true }),
    svc.from("legacy_members").select("*", { count: "exact", head: true }),
    svc.from("grave_markers").select("*", { count: "exact", head: true }),
    svc
      .from("privacy_requests")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending"),
  ]);

  const { data: subs } = await svc.from("subscriptions").select("plan");
  const byPlan = new Map<string, number>();
  for (const s of (subs ?? []) as { plan: string }[]) {
    byPlan.set(s.plan, (byPlan.get(s.plan) ?? 0) + 1);
  }
  const subscriptions = [...byPlan.entries()].map(([plan, count]) => ({
    plan,
    count,
  }));

  const { data: recent } = await svc
    .from("legacies")
    .select("id, slug, full_name, status, created_at, owner_id")
    .order("created_at", { ascending: false })
    .limit(10);
  const recentRows = (recent ?? []) as {
    id: string;
    slug: string;
    full_name: string;
    status: string;
    created_at: string;
    owner_id: string;
  }[];

  const ownerIds = [...new Set(recentRows.map((r) => r.owner_id))];
  const emailById = new Map<string, string>();
  if (ownerIds.length > 0) {
    const { data: profs } = await svc
      .from("profiles")
      .select("id, email")
      .in("id", ownerIds);
    for (const p of (profs ?? []) as { id: string; email: string | null }[]) {
      if (p.email) emailById.set(p.id, p.email);
    }
  }

  const recentLegacies: AdminLegacy[] = recentRows.map((r) => ({
    id: r.id,
    slug: r.slug,
    full_name: r.full_name,
    status: r.status,
    created_at: r.created_at,
    owner_email: emailById.get(r.owner_id) ?? null,
  }));

  const { data: leads } = await svc
    .from("partner_leads")
    .select("id, organization, name, email, phone, message, created_at")
    .order("created_at", { ascending: false })
    .limit(20);

  return {
    counts: {
      legacies: legaciesC.count ?? 0,
      users: usersC.count ?? 0,
      members: membersC.count ?? 0,
      markers: markersC.count ?? 0,
    },
    subscriptions,
    privacyPending: privacyC.count ?? 0,
    recentLegacies,
    partnerLeads: (leads ?? []) as AdminLead[],
  };
}
