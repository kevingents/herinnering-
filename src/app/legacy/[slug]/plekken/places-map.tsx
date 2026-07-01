"use client";

import { useEffect, useRef } from "react";
import type { Place } from "@/lib/data/places";

/* Leaflet is loaded lazily from a CDN so we add no bundler dependency and it
   never runs during SSR. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type L = any;
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    L?: any;
  }
}

let leafletPromise: Promise<L> | null = null;
function loadLeaflet(): Promise<L> {
  if (typeof window === "undefined") return Promise.reject(new Error("no window"));
  if (window.L) return Promise.resolve(window.L);
  if (leafletPromise) return leafletPromise;
  leafletPromise = new Promise<L>((resolve, reject) => {
    if (!document.querySelector("link[data-leaflet]")) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      link.setAttribute("data-leaflet", "");
      document.head.appendChild(link);
    }
    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.async = true;
    script.onload = () => resolve(window.L);
    script.onerror = () => reject(new Error("leaflet load failed"));
    document.body.appendChild(script);
  });
  return leafletPromise;
}

function pinIcon(L: L, selected: boolean) {
  const color = selected ? "#3c4b36" : "#56714e";
  const size = selected ? 42 : 34;
  const html = `<div style="transform:translate(-50%,-100%);filter:drop-shadow(0 6px 6px rgba(60,75,54,.35))">
    <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="${color}" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
      <circle cx="12" cy="9" r="2.6" fill="#f7f4ee"/>
    </svg></div>`;
  return L.divIcon({ html, className: "", iconSize: [size, size], iconAnchor: [0, 0] });
}

function userIcon(L: L) {
  const html = `<div style="transform:translate(-50%,-50%)">
    <span style="display:block;width:18px;height:18px;border-radius:9999px;background:#c07d5b;border:3px solid #f7f4ee;box-shadow:0 0 0 4px rgba(192,125,91,.3)"></span>
  </div>`;
  return L.divIcon({ html, className: "", iconSize: [18, 18], iconAnchor: [0, 0] });
}

export function PlacesMap({
  places,
  selectedId,
  userPos,
  onSelect,
}: {
  places: Place[];
  selectedId: string | null;
  userPos: { lat: number; lng: number } | null;
  onSelect: (id: string) => void;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L | null>(null);
  const markersRef = useRef<Map<string, L>>(new Map());
  const userMarkerRef = useRef<L | null>(null);
  // Keep the latest onSelect without re-running the init effect.
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;

  // Init once.
  useEffect(() => {
    let cancelled = false;
    loadLeaflet()
      .then((L) => {
        if (cancelled || !containerRef.current || mapRef.current) return;
        const map = L.map(containerRef.current, {
          scrollWheelZoom: false,
          attributionControl: true,
        }).setView([52.13, 5.29], 7);
        L.tileLayer(
          "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
          {
            maxZoom: 19,
            attribution:
              '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
          },
        ).addTo(map);
        mapRef.current = map;
        renderMarkers(L, map);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markersRef.current.clear();
        userMarkerRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function renderMarkers(L: L, map: L) {
    markersRef.current.forEach((m) => m.remove());
    markersRef.current.clear();
    const pts: [number, number][] = [];
    for (const p of places) {
      const marker = L.marker([p.latitude, p.longitude], {
        icon: pinIcon(L, p.id === selectedId),
      })
        .addTo(map)
        .on("click", () => onSelectRef.current(p.id));
      marker.bindPopup(
        `<strong style="font-family:serif">${escapeHtml(p.title ?? "Herinnering")}</strong>` +
          (p.locationName
            ? `<br/><span style="color:#6f6a5c">${escapeHtml(p.locationName)}</span>`
            : ""),
      );
      markersRef.current.set(p.id, marker);
      pts.push([p.latitude, p.longitude]);
    }
    if (pts.length > 0 && !selectedId) {
      if (pts.length === 1) map.setView(pts[0], 12);
      else map.fitBounds(pts, { padding: [40, 40] });
    }
  }

  // Re-render markers when the set changes.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !window.L) return;
    renderMarkers(window.L, map);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [places]);

  // Fly to the selected place and refresh icons.
  useEffect(() => {
    const map = mapRef.current;
    const L = window.L;
    if (!map || !L) return;
    markersRef.current.forEach((m, id) =>
      m.setIcon(pinIcon(L, id === selectedId)),
    );
    if (selectedId) {
      const p = places.find((x) => x.id === selectedId);
      const marker = markersRef.current.get(selectedId);
      if (p) map.flyTo([p.latitude, p.longitude], Math.max(map.getZoom(), 13));
      if (marker) marker.openPopup();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId]);

  // User location marker.
  useEffect(() => {
    const map = mapRef.current;
    const L = window.L;
    if (!map || !L) return;
    if (userMarkerRef.current) {
      userMarkerRef.current.remove();
      userMarkerRef.current = null;
    }
    if (userPos) {
      userMarkerRef.current = L.marker([userPos.lat, userPos.lng], {
        icon: userIcon(L),
        interactive: false,
      }).addTo(map);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userPos]);

  return (
    <div
      ref={containerRef}
      className="h-[420px] w-full overflow-hidden rounded-2xl border border-border bg-surface"
      role="application"
      aria-label="Kaart met plekken"
    />
  );
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
