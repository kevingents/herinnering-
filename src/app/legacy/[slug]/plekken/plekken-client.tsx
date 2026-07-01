"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { nl } from "date-fns/locale";
import { Compass, Loader2, MapPin, Navigation, Trash2 } from "lucide-react";
import type { Place } from "@/lib/data/places";
import { PlacesMap } from "./places-map";
import { PlaceAdder } from "./place-adder";
import { deletePlace } from "./actions";

function haversineKm(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.lat * Math.PI) / 180) *
      Math.cos((b.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

function formatDistance(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)} m`;
  if (km < 10) return `${km.toFixed(1)} km`;
  return `${Math.round(km)} km`;
}

export function PlekkenClient({
  slug,
  legacyId,
  places,
  canEdit,
}: {
  slug: string;
  legacyId: string;
  places: Place[];
  canEdit: boolean;
}) {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [userPos, setUserPos] = useState<{ lat: number; lng: number } | null>(
    null,
  );
  const [locating, setLocating] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const distances = new Map<string, number>();
  if (userPos) {
    for (const p of places) {
      distances.set(
        p.id,
        haversineKm(userPos, { lat: p.latitude, lng: p.longitude }),
      );
    }
  }

  const ordered = userPos
    ? [...places].sort(
        (a, b) => (distances.get(a.id) ?? 0) - (distances.get(b.id) ?? 0),
      )
    : places;

  function standWhereTheyStood() {
    if (!("geolocation" in navigator)) {
      setGeoError("Je apparaat ondersteunt locatiebepaling niet.");
      return;
    }
    setLocating(true);
    setGeoError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const here = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        setUserPos(here);
        setLocating(false);
        if (places.length > 0) {
          const nearest = [...places].sort(
            (a, b) =>
              haversineKm(here, { lat: a.latitude, lng: a.longitude }) -
              haversineKm(here, { lat: b.latitude, lng: b.longitude }),
          )[0];
          setSelectedId(nearest.id);
        }
      },
      () => {
        setLocating(false);
        setGeoError(
          "We konden je locatie niet ophalen. Geef toestemming en probeer opnieuw.",
        );
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }

  async function remove(id: string) {
    setDeletingId(id);
    const res = await deletePlace({ slug, id });
    setDeletingId(null);
    if (res && "error" in res) {
      setGeoError(res.error);
      return;
    }
    if (selectedId === id) setSelectedId(null);
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          type="button"
          onClick={standWhereTheyStood}
          disabled={locating || places.length === 0}
          className="inline-flex h-12 items-center justify-center gap-2.5 rounded-full border border-forest/40 bg-forest/[0.06] px-6 font-meta text-xs uppercase tracking-[0.14em] text-forest transition-colors hover:bg-forest/[0.12] disabled:opacity-50"
        >
          {locating ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Compass className="size-4" />
          )}
          Sta op de plek
        </button>
        {canEdit ? <PlaceAdder slug={slug} legacyId={legacyId} /> : null}
      </div>

      {geoError ? (
        <p className="font-body text-sm text-danger">{geoError}</p>
      ) : null}

      <PlacesMap
        places={places}
        selectedId={selectedId}
        userPos={userPos}
        onSelect={setSelectedId}
      />

      {userPos ? (
        <p className="flex items-center gap-2 text-meta text-foreground-muted">
          <Navigation className="size-3.5 text-amber" />
          Je locatie staat op de kaart. De plekken hieronder staan gesorteerd op
          afstand.
        </p>
      ) : null}

      <section>
        <div className="flex items-center gap-4">
          <span className="text-meta">
            {places.length} {places.length === 1 ? "plek" : "plekken"}
          </span>
          <span className="h-px flex-1 bg-border" />
        </div>

        {places.length === 0 ? (
          <p className="mt-8 text-center font-body text-lg italic text-foreground-muted">
            Nog geen plekken. Voeg de eerste plek toe waar het leven zich
            afspeelde.
          </p>
        ) : (
          <ul className="mt-6 flex flex-col gap-3">
            {ordered.map((p) => {
              const dist = distances.get(p.id);
              const active = p.id === selectedId;
              return (
                <li key={p.id}>
                  <div
                    className={
                      "flex gap-4 rounded-2xl border p-4 transition-colors " +
                      (active
                        ? "border-forest/50 bg-forest/[0.05]"
                        : "border-border bg-surface")
                    }
                  >
                    <button
                      type="button"
                      onClick={() => setSelectedId(p.id)}
                      className="flex flex-1 items-start gap-4 text-left"
                    >
                      {p.coverUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={p.coverUrl}
                          alt=""
                          loading="lazy"
                          className="size-16 shrink-0 rounded-xl object-cover"
                        />
                      ) : (
                        <span className="flex size-16 shrink-0 items-center justify-center rounded-xl border border-border bg-gold/[0.06] text-forest">
                          <MapPin className="size-5" />
                        </span>
                      )}
                      <span className="flex flex-col gap-1">
                        <span className="font-display text-lg leading-snug text-foreground">
                          {p.title ?? "Herinnering"}
                        </span>
                        {p.locationName ? (
                          <span className="flex items-center gap-1.5 text-meta text-foreground-muted">
                            <MapPin className="size-3" />
                            {p.locationName}
                          </span>
                        ) : null}
                        {p.body ? (
                          <span className="line-clamp-2 font-body text-[0.95rem] text-foreground-secondary">
                            {p.body}
                          </span>
                        ) : null}
                        <span className="flex flex-wrap items-center gap-x-3 text-meta text-foreground-muted">
                          {p.memoryDate ? (
                            <span>
                              {format(new Date(p.memoryDate), "d MMMM yyyy", {
                                locale: nl,
                              })}
                            </span>
                          ) : null}
                          {typeof dist === "number" ? (
                            <span className="text-amber">
                              {formatDistance(dist)} hiervandaan
                            </span>
                          ) : null}
                        </span>
                      </span>
                    </button>
                    {canEdit ? (
                      <button
                        type="button"
                        onClick={() => remove(p.id)}
                        disabled={deletingId === p.id}
                        aria-label="Plek verwijderen"
                        className="inline-flex size-9 shrink-0 items-center justify-center rounded-full text-foreground-muted transition-colors hover:bg-danger/10 hover:text-danger disabled:opacity-50"
                      >
                        {deletingId === p.id ? (
                          <Loader2 className="size-4 animate-spin" />
                        ) : (
                          <Trash2 className="size-4" />
                        )}
                      </button>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
