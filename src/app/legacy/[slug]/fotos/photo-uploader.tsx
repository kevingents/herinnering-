"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ImagePlus, Loader2, Upload, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { recordPhotos } from "./actions";
import { Slab } from "@/components/ui/slab";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function PhotoUploader({
  slug,
  legacyId,
}: {
  slug: string;
  legacyId: string;
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [caption, setCaption] = useState("");
  const [takenAt, setTakenAt] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function pick(list: FileList | null) {
    const picked = Array.from(list ?? []).filter((f) =>
      f.type.startsWith("image/"),
    );
    if (picked.length === 0) return;
    previews.forEach((p) => URL.revokeObjectURL(p));
    setFiles(picked);
    setPreviews(picked.map((f) => URL.createObjectURL(f)));
    setError(null);
  }

  function clearAll() {
    previews.forEach((p) => URL.revokeObjectURL(p));
    setFiles([]);
    setPreviews([]);
    if (inputRef.current) inputRef.current.value = "";
  }

  async function upload() {
    if (files.length === 0) return;
    setBusy(true);
    setError(null);

    const supabase = createClient();
    const items: { path: string; name: string; type: string; size: number }[] = [];

    for (const file of files) {
      const ext = (file.type.split("/")[1] || "jpg").replace("jpeg", "jpg");
      const path = `${legacyId}/photos/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("media")
        .upload(path, file, { contentType: file.type, upsert: false });
      if (upErr) {
        setError(`Uploaden mislukt: ${upErr.message}`);
        setBusy(false);
        return;
      }
      items.push({ path, name: file.name, type: file.type, size: file.size });
    }

    const res = await recordPhotos({
      slug,
      legacyId,
      caption: caption.trim() || null,
      takenAt: takenAt || null,
      items,
    });
    if (res && "error" in res) {
      setError(res.error);
      setBusy(false);
      return;
    }

    clearAll();
    setCaption("");
    setTakenAt("");
    setBusy(false);
    router.refresh();
  }

  return (
    <Slab className="p-7 sm:p-8">
      {previews.length === 0 ? (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex w-full flex-col items-center gap-3 rounded-2xl border border-dashed border-border py-12 text-foreground-muted transition-colors hover:border-forest/50 hover:text-foreground"
        >
          <ImagePlus className="size-7 text-forest" />
          <span className="font-body text-base">Kies foto&apos;s om te uploaden</span>
          <span className="text-meta">JPG, PNG of WebP</span>
        </button>
      ) : (
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {previews.map((src, i) => (
              <img
                key={i}
                src={src}
                alt=""
                className="aspect-square w-full rounded-xl object-cover"
              />
            ))}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="caption">Beschrijving (optioneel)</Label>
              <Input
                id="caption"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Bijv. Zomer in Pals, 2003"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="takenAt">Datum (optioneel)</Label>
              <Input
                id="takenAt"
                type="date"
                value={takenAt}
                onChange={(e) => setTakenAt(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={upload}
              disabled={busy}
              className="inline-flex h-12 items-center justify-center gap-2.5 rounded-full bg-forest px-7 font-meta text-xs uppercase tracking-[0.14em] text-cream transition-all hover:bg-forest-deep disabled:opacity-50"
            >
              {busy ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Uploaden…
                </>
              ) : (
                <>
                  <Upload className="size-4" />
                  Upload {files.length} foto&apos;s
                </>
              )}
            </button>
            <button
              type="button"
              onClick={clearAll}
              disabled={busy}
              className="inline-flex items-center gap-2 text-meta transition-colors hover:text-forest"
            >
              <X className="size-3.5" />
              Wissen
            </button>
          </div>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(e) => pick(e.target.files)}
      />

      {error ? (
        <p className="mt-4 font-body text-sm text-danger">{error}</p>
      ) : null}
    </Slab>
  );
}
