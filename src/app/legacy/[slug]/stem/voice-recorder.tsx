"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2, Mic, RotateCcw, Square } from "lucide-react";
import { saveVoiceSample } from "./actions";
import { VOICE_EMOTIONS, EMOTION_LABEL } from "@/lib/voice-emotions";
import { Slab } from "@/components/ui/slab";
import { cn } from "@/lib/utils";

type Status = "idle" | "recording" | "recorded" | "saving";

function pickMime(): string {
  if (typeof MediaRecorder === "undefined") return "";
  const candidates = [
    "audio/webm;codecs=opus",
    "audio/webm",
    "audio/mp4",
    "audio/ogg;codecs=opus",
  ];
  for (const c of candidates) {
    if (MediaRecorder.isTypeSupported(c)) return c;
  }
  return "";
}

function fmt(s: number): string {
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

export function VoiceRecorder({
  slug,
  legacyId,
}: {
  slug: string;
  legacyId: string;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<Status>("idle");
  const [emotion, setEmotion] = useState<string>("rustig");
  const [seconds, setSeconds] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const blobRef = useRef<Blob | null>(null);
  const durationRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      streamRef.current?.getTracks().forEach((t) => t.stop());
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  async function start() {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mime = pickMime();
      const rec = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined);
      chunksRef.current = [];
      rec.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      rec.onstop = () => {
        const type = rec.mimeType || mime || "audio/webm";
        const blob = new Blob(chunksRef.current, { type });
        blobRef.current = blob;
        setPreviewUrl(URL.createObjectURL(blob));
        streamRef.current?.getTracks().forEach((t) => t.stop());
        setStatus("recorded");
      };
      recorderRef.current = rec;
      rec.start();
      durationRef.current = 0;
      setSeconds(0);
      setStatus("recording");
      timerRef.current = setInterval(() => {
        durationRef.current += 1;
        setSeconds((s) => s + 1);
      }, 1000);
    } catch {
      setError("Geen toegang tot de microfoon. Sta het toe in je browser en probeer opnieuw.");
      setStatus("idle");
    }
  }

  function stop() {
    if (timerRef.current) clearInterval(timerRef.current);
    recorderRef.current?.stop();
  }

  function reset() {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    blobRef.current = null;
    durationRef.current = 0;
    setSeconds(0);
    setStatus("idle");
  }

  async function save() {
    if (!blobRef.current) return;
    setStatus("saving");
    setError(null);
    const type = blobRef.current.type;
    const ext = type.includes("mp4") ? "mp4" : type.includes("ogg") ? "ogg" : "webm";
    const fd = new FormData();
    fd.set("slug", slug);
    fd.set("legacyId", legacyId);
    fd.set("emotion", emotion);
    fd.set("duration", String(durationRef.current));
    fd.set("audio", blobRef.current, `opname.${ext}`);

    const res = await saveVoiceSample(fd);
    if (res && "error" in res) {
      setError(res.error);
      setStatus("recorded");
      return;
    }
    reset();
    router.refresh();
  }

  return (
    <Slab featured className="p-7 sm:p-9">
      {/* emotion */}
      <span className="text-meta">Kies een emotie</span>
      <div className="mt-4 flex flex-wrap gap-2.5">
        {VOICE_EMOTIONS.map((e) => (
          <button
            key={e}
            type="button"
            onClick={() => setEmotion(e)}
            disabled={status === "recording" || status === "saving"}
            className={cn(
              "rounded-full border px-4 py-2 font-meta text-xs uppercase tracking-[0.12em] transition-colors disabled:opacity-40",
              emotion === e
                ? "border-gold/60 bg-gold/[0.08] text-gold"
                : "border-border text-foreground-muted hover:border-gold/40 hover:text-foreground",
            )}
          >
            {EMOTION_LABEL[e]}
          </button>
        ))}
      </div>

      {/* controls */}
      <div className="mt-8 flex flex-col items-center gap-5 text-center">
        {status === "recording" ? (
          <span className="inline-flex items-center gap-2 font-display text-3xl text-foreground">
            <span className="size-2.5 animate-pulse rounded-full bg-danger" />
            {fmt(seconds)}
          </span>
        ) : null}

        {status === "idle" ? (
          <button
            type="button"
            onClick={start}
            className="inline-flex size-20 items-center justify-center rounded-full border border-gold/45 text-gold transition-all hover:border-gold/80 hover:bg-gold/[0.06] hover:shadow-[0_0_40px_-8px_rgba(201,161,90,0.5)]"
            aria-label="Begin opname"
          >
            <Mic className="size-7" />
          </button>
        ) : null}

        {status === "recording" ? (
          <button
            type="button"
            onClick={stop}
            className="inline-flex size-20 items-center justify-center rounded-full bg-gradient-to-b from-[#d9ba7e] to-[#c9a15a] text-background transition-all hover:brightness-105"
            aria-label="Stop opname"
          >
            <Square className="size-6" fill="currentColor" />
          </button>
        ) : null}

        {status === "recorded" && previewUrl ? (
          <div className="flex w-full flex-col items-center gap-5">
            <audio controls src={previewUrl} className="w-full max-w-sm" />
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={save}
                className="inline-flex h-12 items-center justify-center gap-2.5 rounded-full bg-gradient-to-b from-[#d9ba7e] to-[#c9a15a] px-7 font-meta text-xs uppercase tracking-[0.14em] text-background transition-all hover:brightness-105"
              >
                <Check className="size-4" />
                Bewaar opname
              </button>
              <button
                type="button"
                onClick={reset}
                className="inline-flex items-center gap-2 text-meta transition-colors hover:text-gold"
              >
                <RotateCcw className="size-3.5" />
                Opnieuw
              </button>
            </div>
          </div>
        ) : null}

        {status === "saving" ? (
          <span className="inline-flex items-center gap-2.5 text-meta text-foreground-muted">
            <Loader2 className="size-4 animate-spin" />
            Opslaan…
          </span>
        ) : null}

        <p className="max-w-sm font-body text-sm italic text-foreground-muted">
          {status === "idle"
            ? "Vertel iets in je eigen woorden. Neem gerust de tijd."
            : status === "recording"
              ? "Aan het opnemen…"
              : ""}
        </p>
      </div>

      {error ? (
        <p className="mt-4 text-center font-body text-sm text-danger">{error}</p>
      ) : null}
    </Slab>
  );
}
