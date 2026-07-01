import { format } from "date-fns";
import { nl } from "date-fns/locale";
import { MapPin } from "lucide-react";
import { categoryIcon, categoryLabel } from "@/lib/legacy-categories";
import { Slab } from "@/components/ui/slab";
import type { LifeEvent } from "@/lib/data/legacy";

function formatWhen(e: LifeEvent): string {
  if (!e.event_date) return "";
  const d = new Date(e.event_date);
  if (Number.isNaN(d.getTime())) return e.event_date;
  if (e.date_precision === "year") return format(d, "yyyy", { locale: nl });
  if (e.date_precision === "month") return format(d, "MMMM yyyy", { locale: nl });
  return format(d, "d MMMM yyyy", { locale: nl });
}

export function LegacyTimeline({ events }: { events: LifeEvent[] }) {
  if (events.length === 0) {
    return (
      <p className="mt-10 text-center font-body text-lg italic text-foreground-muted">
        Nog geen gebeurtenissen. Voeg het eerste hoofdstuk toe.
      </p>
    );
  }

  return (
    <div className="relative mx-auto mt-12 max-w-2xl">
      <div
        aria-hidden
        className="absolute bottom-3 left-[7px] top-3 w-px bg-gradient-to-b from-transparent via-gold/30 to-transparent"
      />
      <ol className="flex flex-col gap-8">
        {events.map((e) => {
          const Icon = categoryIcon(e.category);
          const when = formatWhen(e);
          return (
            <li key={e.id} className="relative pl-10">
              <span
                aria-hidden
                className="absolute left-0 top-7 size-[15px] rounded-full border border-gold/50 bg-background shadow-[0_0_16px_rgba(201,161,90,0.35)]"
              >
                <span className="absolute inset-[3px] rounded-full bg-gold/80" />
              </span>
              <Slab className="p-7 sm:p-8">
                <div className="flex flex-wrap items-center gap-3">
                  <Icon className="size-4 text-gold" />
                  {when ? (
                    <span className="font-display text-lg tracking-wide text-gold">
                      {when}
                    </span>
                  ) : null}
                  <span className="text-meta text-foreground-muted">
                    {categoryLabel(e.category)}
                  </span>
                </div>
                <h3 className="mt-3 font-display text-2xl leading-snug text-foreground">
                  {e.title}
                </h3>
                {e.description ? (
                  <p className="mt-3 font-body text-[1.0625rem] leading-relaxed text-foreground-secondary">
                    {e.description}
                  </p>
                ) : null}
                {e.location_name ? (
                  <span className="mt-4 inline-flex items-center gap-1.5 text-meta text-foreground-muted">
                    <MapPin className="size-3.5 text-gold/80" />
                    {e.location_name}
                  </span>
                ) : null}
              </Slab>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
