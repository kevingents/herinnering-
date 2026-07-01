"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, MapPin, Plus, Search, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { addPlace } from "./actions";
import { Slab } from "@/components/ui/slab";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type GeoHit = { name: string; lat: number; lng: number };

export function PlaceAdder({
  slug,
  legacyId,
}: {
  slug: string;
  legacyId: string;
}) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement | null>(null);

  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [memoryDate, setMemoryDate] = useState("");

  const [query, setQuery] = useState("");
  const [hits, setHits] = useState<GeoHit[]>([]);
  const [searching, setSearching] = useState(false);
  const [picked, setPicked] = useState<GeoHit | null>(null);

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function search() {
    const q = query.trim();
    if (q.length < 3) return;
    setSearching(true);
    setError(null);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&limit=5&accept-language=nl&q=${encodeURIComponent(q)}`,
        { headers: { Accept: "application/json" } },
      );
      const data = (await res.json()) as {
        display_name: string;
        lat: string;
        lon: string;
      }[];
      setHits(
        data.map((d) => ({
          name: d.display_name,
          lat: Number(d.lat),
          lng: Number(d.lon),
        })),
      );
    } catch {
      setError("Zoeken naar de plek lukte niet. Probeer het opnieuw.");
    } finally {
      setSearching(false);
    }
  }

  function pickFile(f: File | null) {
    if (preview) URL.revokeObjectURL(preview);
    if (f && f.type.startsWith("image/")) {
      setFile(f);
      setPreview(URL.createObjectURL(f));
    } else {
      setFile(null);
      setPreview(null);
    }
  }

  function reset() {
    setTitle("");
    setBody("");
    setMemoryDate("");
    setQuery("");
    setHits([]);
    setPicked(null);
    pickFile(null);
    if (fileRef.current) fileRef.current.value = "";
    setError(null);
  }

  async function submit() {
    if (!title.trim()) return setError("Geef de herinnering een titel.");
    if (!picked) return setError("Kies eerst een plek via de zoekbalk.");
    setBusy(true);
    setError(null);

    let cover: {
      path: string;
      name: string;
      type: string;
      size: number;
    } | null = null;

    if (file) {
      const supabase = createClient();
      const ext = (file.type.split("/")[1] || "jpg").replace("jpeg", "jpg");
      const path = `${legacyId}/places/${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 8)}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("media")
        .upload(path, file, { contentType: file.type, upsert: false });
      if (upErr) {
        setError(`Foto uploaden mislukt: ${upErr.message}`);
        setBusy(false);
        return;
      }
      cover = { path, name: file.name, type: file.type, size: file.size };
    }

    const res = await addPlace({
      slug,
      legacyId,
      title: title.trim(),
      body: body.trim() || null,
      memoryDate: memoryDate || null,
      locationName: picked.name,
      latitude: picked.lat,
      longitude: picked.lng,
      cover,
    });

    if (res && "error" in res) {
      setError(res.error);
      setBusy(false);
      return;
    }

    reset();
    setBusy(false);
    setOpen(false);
    router.refresh();
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex h-12 items-center justify-center gap-2.5 rounded-full bg-forest px-7 font-meta text-xs uppercase tracking-[0.14em] text-cream transition-all hover:bg-forest-deep"
      >
        <Plus className="size-4" />
        Plek toevoegen
      </button>
    );
  }

  return (
    <Slab className="p-7 sm:p-8">
      <div className="flex flex-col gap-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="place-title">Titel</Label>
            <Input
              id="place-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Bijv. Zomers op het strand van Domburg"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="place-date">Datum (optioneel)</Label>
            <Input
              id="place-date"
              type="date"
              value={memoryDate}
              onChange={(e) => setMemoryDate(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="place-body">Het verhaal (optioneel)</Label>
          <textarea
            id="place-body"
            rows={3}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Wat gebeurde hier? Wat maakt deze plek bijzonder?"
            className="w-full rounded-xl border border-border bg-surface px-4 py-3 font-body text-base leading-relaxed text-foreground placeholder:text-foreground-muted/60 focus-visible:border-forest/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="place-search">Plek</Label>
          {picked ? (
            <div className="flex items-start justify-between gap-3 rounded-xl border border-forest/30 bg-forest/[0.05] px-4 py-3">
              <span className="flex items-start gap-2 font-body text-[0.95rem] text-foreground-secondary">
                <MapPin className="mt-0.5 size-4 shrink-0 text-forest" />
                {picked.name}
              </span>
              <button
                type="button"
                onClick={() => setPicked(null)}
                className="text-meta transition-colors hover:text-forest"
              >
                <X className="size-4" />
              </button>
            </div>
          ) : (
            <>
              <div className="flex gap-2">
                <Input
                  id="place-search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      void search();
                    }
                  }}
                  placeholder="Zoek een plaats, straat of adres…"
                />
                <button
                  type="button"
                  onClick={() => void search()}
                  disabled={searching || query.trim().length < 3}
                  className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-full border border-border px-5 text-meta transition-colors hover:border-forest/50 hover:text-forest disabled:opacity-50"
                >
                  {searching ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Search className="size-4" />
                  )}
                  Zoek
                </button>
              </div>
              {hits.length > 0 ? (
                <ul className="mt-1 flex flex-col overflow-hidden rounded-xl border border-border">
                  {hits.map((h, i) => (
                    <li key={i}>
                      <button
                        type="button"
                        onClick={() => {
                          setPicked(h);
                          setHits([]);
                          setQuery("");
                        }}
                        className="flex w-full items-start gap-2 border-b border-border bg-surface px-4 py-2.5 text-left font-body text-sm text-foreground-secondary transition-colors last:border-b-0 hover:bg-forest/[0.05]"
                      >
                        <MapPin className="mt-0.5 size-3.5 shrink-0 text-forest" />
                        {h.name}
                      </button>
                    </li>
                  ))}
                </ul>
              ) : null}
            </>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="place-photo">Foto (optioneel)</Label>
          {preview ? (
            <div className="flex items-center gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={preview}
                alt=""
                className="size-20 rounded-xl object-cover"
              />
              <button
                type="button"
                onClick={() => {
                  pickFile(null);
                  if (fileRef.current) fileRef.current.value = "";
                }}
                className="inline-flex items-center gap-2 text-meta transition-colors hover:text-forest"
              >
                <X className="size-3.5" />
                Verwijder foto
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="inline-flex h-11 w-fit items-center gap-2 rounded-full border border-dashed border-border px-5 text-meta transition-colors hover:border-forest/50 hover:text-forest"
            >
              <Plus className="size-4" />
              Foto kiezen
            </button>
          )}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => pickFile(e.target.files?.[0] ?? null)}
          />
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={() => void submit()}
            disabled={busy}
            className="inline-flex h-12 items-center justify-center gap-2.5 rounded-full bg-forest px-7 font-meta text-xs uppercase tracking-[0.14em] text-cream transition-all hover:bg-forest-deep disabled:opacity-50"
          >
            {busy ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Bewaren…
              </>
            ) : (
              <>
                <MapPin className="size-4" />
                Plek bewaren
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => {
              reset();
              setOpen(false);
            }}
            disabled={busy}
            className="inline-flex items-center gap-2 text-meta transition-colors hover:text-forest"
          >
            <X className="size-3.5" />
            Annuleren
          </button>
        </div>

        {error ? (
          <p className="font-body text-sm text-danger">{error}</p>
        ) : null}
      </div>
    </Slab>
  );
}
