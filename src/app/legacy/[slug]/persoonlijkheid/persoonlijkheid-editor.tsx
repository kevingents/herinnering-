"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2, Sparkles, Wand2 } from "lucide-react";
import type { Personality } from "@/lib/data/personality";
import { Slab } from "@/components/ui/slab";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { savePersonality, generatePersonality } from "./actions";

const textarea =
  "w-full rounded-xl border border-border bg-surface px-4 py-3 font-body text-base leading-relaxed text-foreground placeholder:text-foreground-muted/60 focus-visible:border-forest/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest";

export function PersoonlijkheidEditor({
  slug,
  legacyId,
  initial,
  canEdit,
  aiConfigured,
}: {
  slug: string;
  legacyId: string;
  initial: Personality | null;
  canEdit: boolean;
  aiConfigured: boolean;
}) {
  const router = useRouter();
  const [summary, setSummary] = useState(initial?.summary ?? "");
  const [tone, setTone] = useState(initial?.tone ?? "");
  const [humor, setHumor] = useState(initial?.humor ?? "");
  const [philosophy, setPhilosophy] = useState(initial?.philosophy ?? "");
  const [values, setValues] = useState((initial?.values ?? []).join(", "));
  const [traits, setTraits] = useState((initial?.traits ?? []).join(", "));
  const [phrases, setPhrases] = useState(
    (initial?.favoritePhrases ?? []).join(", "),
  );

  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const split = (s: string) =>
    s
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean);

  async function save() {
    setSaving(true);
    setError(null);
    setSaved(false);
    const res = await savePersonality({
      slug,
      legacyId,
      summary,
      tone,
      humor,
      philosophy,
      values: split(values),
      traits: split(traits),
      favoritePhrases: split(phrases),
    });
    setSaving(false);
    if (res && "error" in res) return setError(res.error);
    setSaved(true);
    router.refresh();
  }

  async function generate() {
    setGenerating(true);
    setError(null);
    setSaved(false);
    const res = await generatePersonality({ slug, legacyId });
    setGenerating(false);
    if (res && "error" in res) return setError(res.error);
    const d = res.draft;
    setSummary(d.summary);
    setTone(d.tone);
    setHumor(d.humor);
    setPhilosophy(d.philosophy);
    setValues(d.values.join(", "));
    setTraits(d.traits.join(", "));
    setPhrases(d.favoritePhrases.join(", "));
    setSaved(true);
    router.refresh();
  }

  if (!canEdit) {
    // Read-only view for people who may see but not edit.
    const has =
      initial &&
      (initial.summary ||
        initial.tone ||
        initial.values.length ||
        initial.traits.length);
    if (!has) {
      return (
        <p className="text-center font-body text-lg italic text-foreground-muted">
          Er is nog geen persoonlijkheidsprofiel vastgelegd.
        </p>
      );
    }
    return (
      <Slab className="flex flex-col gap-5 p-7 sm:p-8">
        {initial?.summary ? (
          <p className="font-body text-lg leading-relaxed text-foreground-secondary">
            {initial.summary}
          </p>
        ) : null}
        <ReadRow label="Toon" value={initial?.tone} />
        <ReadRow label="Humor" value={initial?.humor} />
        <ReadTags label="Waarden" tags={initial?.values ?? []} />
        <ReadTags label="Eigenschappen" tags={initial?.traits ?? []} />
        <ReadTags label="Uitdrukkingen" tags={initial?.favoritePhrases ?? []} />
        <ReadRow label="Levensvisie" value={initial?.philosophy} />
      </Slab>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {aiConfigured ? (
        <Slab className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-1">
            <span className="flex items-center gap-2 font-display text-lg text-foreground">
              <Sparkles className="size-4 text-gold" />
              Laat de AI een voorzet doen
            </span>
            <span className="font-body text-sm text-foreground-muted">
              Afgeleid uit alles wat is vastgelegd — je kunt daarna alles zelf
              bijschaven.
            </span>
          </div>
          <button
            type="button"
            onClick={generate}
            disabled={generating || saving}
            className="inline-flex h-12 shrink-0 items-center justify-center gap-2.5 rounded-full border border-gold/40 bg-gold/[0.06] px-6 font-meta text-xs uppercase tracking-[0.14em] text-gold transition-colors hover:bg-gold/[0.12] disabled:opacity-50"
          >
            {generating ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Analyseren…
              </>
            ) : (
              <>
                <Wand2 className="size-4" />
                Genereer met AI
              </>
            )}
          </button>
        </Slab>
      ) : null}

      <Slab className="flex flex-col gap-6 p-7 sm:p-8">
        <div className="flex flex-col gap-2">
          <Label htmlFor="p-summary">Samenvatting</Label>
          <textarea
            id="p-summary"
            rows={3}
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="Wie was deze persoon, in een paar zinnen?"
            className={textarea}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="p-tone">Toon</Label>
            <Input
              id="p-tone"
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              placeholder="Bijv. warm, nuchter, bedachtzaam"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="p-humor">Humor</Label>
            <Input
              id="p-humor"
              value={humor}
              onChange={(e) => setHumor(e.target.value)}
              placeholder="Bijv. droog, zelfspot, ondeugend"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="p-values">Waarden (komma-gescheiden)</Label>
          <Input
            id="p-values"
            value={values}
            onChange={(e) => setValues(e.target.value)}
            placeholder="familie, eerlijkheid, doorzetten"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="p-traits">Eigenschappen (komma-gescheiden)</Label>
          <Input
            id="p-traits"
            value={traits}
            onChange={(e) => setTraits(e.target.value)}
            placeholder="geduldig, koppig, zorgzaam"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="p-phrases">
            Kenmerkende uitdrukkingen (komma-gescheiden)
          </Label>
          <Input
            id="p-phrases"
            value={phrases}
            onChange={(e) => setPhrases(e.target.value)}
            placeholder="&ldquo;Kom, we gaan&rdquo;, &ldquo;Het komt goed&rdquo;"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="p-philosophy">Levensvisie</Label>
          <textarea
            id="p-philosophy"
            rows={3}
            value={philosophy}
            onChange={(e) => setPhilosophy(e.target.value)}
            placeholder="Waar geloofde deze persoon in? Wat gaf richting?"
            className={textarea}
          />
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={save}
            disabled={saving || generating}
            className="inline-flex h-12 items-center justify-center gap-2.5 rounded-full bg-forest px-7 font-meta text-xs uppercase tracking-[0.14em] text-cream transition-all hover:bg-forest-deep disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Bewaren…
              </>
            ) : (
              <>
                <Check className="size-4" />
                Bewaren
              </>
            )}
          </button>
          {saved ? (
            <span className="flex items-center gap-1.5 text-meta text-forest">
              <Check className="size-3.5" />
              Bewaard
            </span>
          ) : null}
        </div>

        {error ? (
          <p className="font-body text-sm text-danger">{error}</p>
        ) : null}
      </Slab>
    </div>
  );
}

function ReadRow({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className="flex flex-col gap-1">
      <span className="text-meta text-foreground-muted">{label}</span>
      <span className="font-body text-base text-foreground-secondary">
        {value}
      </span>
    </div>
  );
}

function ReadTags({ label, tags }: { label: string; tags: string[] }) {
  if (!tags.length) return null;
  return (
    <div className="flex flex-col gap-2">
      <span className="text-meta text-foreground-muted">{label}</span>
      <div className="flex flex-wrap gap-2">
        {tags.map((t) => (
          <span
            key={t}
            className="rounded-full border border-border bg-gold/[0.05] px-3 py-1 font-meta text-xs text-foreground-secondary"
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}
