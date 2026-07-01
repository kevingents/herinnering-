import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/** Download all of the current user's data as JSON (AVG data portability). */
export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { data: legacies } = await supabase
    .from("legacies")
    .select("*")
    .eq("owner_id", user.id);

  const out = {
    exportedFor: user.email,
    exportedAt: new Date().toISOString(),
    legacies: [] as unknown[],
  };

  for (const legacy of (legacies ?? []) as { id: string }[]) {
    const id = legacy.id;
    const [memories, events, people, answers, capsules, media, voices] =
      await Promise.all([
        supabase.from("memories").select("*").eq("legacy_id", id),
        supabase.from("life_events").select("*").eq("legacy_id", id),
        supabase.from("people").select("*").eq("legacy_id", id),
        supabase.from("interview_answers").select("*").eq("legacy_id", id),
        supabase.from("time_capsules").select("*").eq("legacy_id", id),
        supabase.from("media_assets").select("*").eq("legacy_id", id),
        supabase.from("voice_samples").select("*").eq("legacy_id", id),
      ]);
    out.legacies.push({
      ...legacy,
      memories: memories.data ?? [],
      life_events: events.data ?? [],
      people: people.data ?? [],
      interview_answers: answers.data ?? [],
      time_capsules: capsules.data ?? [],
      media_assets: media.data ?? [],
      voice_samples: voices.data ?? [],
    });
  }

  return new NextResponse(JSON.stringify(out, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": 'attachment; filename="everlooms-export.json"',
    },
  });
}
