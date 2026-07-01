"use client";

import { useRef, useState } from "react";
import { Quote, Send } from "lucide-react";
import { askMemorial, type ChatTurn } from "./actions";
import { Slab } from "@/components/ui/slab";
import { cn } from "@/lib/utils";

const STARTERS = [
  "Hoe was je jeugd?",
  "Waar ben je het meest trots op?",
  "Wat wil je dat we onthouden?",
];

export function MemorialChat({
  code,
  name,
}: {
  code: string;
  name: string;
}) {
  const firstName = name.split(" ")[0] || name;
  const [messages, setMessages] = useState<ChatTurn[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const endRef = useRef<HTMLDivElement | null>(null);

  async function send(question: string) {
    const q = question.trim();
    if (!q || sending) return;

    const history = messages;
    setMessages((prev) => [...prev, { role: "user", content: q }]);
    setInput("");
    setSending(true);

    const res = await askMemorial(code, q, history);
    const reply = "answer" in res ? res.answer : res.error;
    setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    setSending(false);
    requestAnimationFrame(() =>
      endRef.current?.scrollIntoView({ behavior: "smooth" }),
    );
  }

  return (
    <Slab featured className="flex flex-col p-6 sm:p-8">
      <div className="flex items-center gap-2.5">
        <span
          aria-hidden
          className="size-2.5 rounded-full bg-amber shadow-[0_0_24px_6px_rgba(224,184,118,0.35)] motion-safe:animate-breathe"
        />
        <span className="text-meta">Praat met een herinnering aan {firstName}</span>
      </div>

      {/* conversation */}
      {messages.length > 0 ? (
        <div className="mt-6 flex flex-col gap-5">
          {messages.map((m, i) =>
            m.role === "user" ? (
              <div
                key={i}
                className="max-w-[85%] self-end rounded-2xl rounded-br-md border border-border bg-surface-elevated px-4 py-3"
              >
                <p className="font-body text-[1.0625rem] text-foreground-secondary">
                  {m.content}
                </p>
              </div>
            ) : (
              <div key={i} className="max-w-[90%] self-start">
                <div className="flex items-start gap-2.5">
                  <Quote className="mt-1 size-4 shrink-0 text-gold/70" />
                  <p className="whitespace-pre-line font-body text-lg italic leading-relaxed text-foreground">
                    {m.content}
                  </p>
                </div>
              </div>
            ),
          )}
          {sending ? (
            <span className="self-start pl-6 text-meta text-foreground-muted">
              {firstName} denkt na…
            </span>
          ) : null}
          <div ref={endRef} />
        </div>
      ) : (
        <div className="mt-6 flex flex-col gap-4">
          <p className="font-body text-lg italic leading-relaxed text-foreground-muted">
            Stel een vraag. De herinnering antwoordt met {firstName}s eigen
            woorden en verhalen — en zegt eerlijk wanneer iets niet is
            vastgelegd.
          </p>
          <div className="flex flex-wrap gap-2.5">
            {STARTERS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => send(s)}
                className="rounded-full border border-border px-4 py-2 font-body text-sm text-foreground-secondary transition-colors hover:border-gold/50 hover:text-foreground"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void send(input);
        }}
        className="mt-7 flex items-center gap-3"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={sending}
          placeholder={`Vraag ${firstName} iets…`}
          className="h-12 flex-1 rounded-full border border-border bg-surface px-5 font-body text-base text-foreground placeholder:text-foreground-muted/70 focus-visible:border-gold/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={sending || !input.trim()}
          aria-label="Verstuur"
          className={cn(
            "inline-flex size-12 shrink-0 items-center justify-center rounded-full bg-forest text-cream transition-all hover:brightness-105 disabled:opacity-40",
          )}
        >
          <Send className="size-4" />
        </button>
      </form>
    </Slab>
  );
}
