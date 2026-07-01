"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FilePlus, Loader2, Upload, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { recordDocuments } from "./actions";
import { Slab } from "@/components/ui/slab";

const ACCEPT =
  ".pdf,.doc,.docx,.txt,.rtf,.odt,image/*,application/pdf";

function extOf(file: File): string {
  const fromName = file.name.includes(".") ? file.name.split(".").pop() : "";
  return (fromName || file.type.split("/")[1] || "bin").toLowerCase();
}

export function DocumentUploader({
  slug,
  legacyId,
}: {
  slug: string;
  legacyId: string;
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function upload() {
    if (files.length === 0) return;
    setBusy(true);
    setError(null);

    const supabase = createClient();
    const items: { path: string; name: string; type: string; size: number }[] = [];
    for (const file of files) {
      const path = `${legacyId}/documents/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${extOf(file)}`;
      const { error: upErr } = await supabase.storage
        .from("media")
        .upload(path, file, {
          contentType: file.type || "application/octet-stream",
          upsert: false,
        });
      if (upErr) {
        setError(`Uploaden mislukt: ${upErr.message}`);
        setBusy(false);
        return;
      }
      items.push({
        path,
        name: file.name,
        type: file.type || "application/octet-stream",
        size: file.size,
      });
    }

    const res = await recordDocuments({ slug, legacyId, items });
    if (res && "error" in res) {
      setError(res.error);
      setBusy(false);
      return;
    }
    setFiles([]);
    if (inputRef.current) inputRef.current.value = "";
    setBusy(false);
    router.refresh();
  }

  return (
    <Slab className="p-7 sm:p-8">
      {files.length === 0 ? (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex w-full flex-col items-center gap-3 rounded-2xl border border-dashed border-border py-12 text-foreground-muted transition-colors hover:border-forest/50 hover:text-foreground"
        >
          <FilePlus className="size-7 text-forest" />
          <span className="font-body text-base">Kies documenten</span>
          <span className="text-meta">Brieven, dagboeken, PDF&apos;s</span>
        </button>
      ) : (
        <div className="flex flex-col gap-5">
          <ul className="flex flex-col gap-2">
            {files.map((f, i) => (
              <li
                key={i}
                className="flex items-center justify-between rounded-lg border border-border bg-surface px-4 py-2.5"
              >
                <span className="truncate font-body text-sm text-foreground-secondary">
                  {f.name}
                </span>
                <span className="text-meta text-foreground-muted">
                  {Math.round(f.size / 1024)} kB
                </span>
              </li>
            ))}
          </ul>
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
                  Upload {files.length}
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => {
                setFiles([]);
                if (inputRef.current) inputRef.current.value = "";
              }}
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
        accept={ACCEPT}
        multiple
        hidden
        onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
      />

      {error ? <p className="mt-4 font-body text-sm text-danger">{error}</p> : null}
    </Slab>
  );
}
