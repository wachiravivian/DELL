"use client";

import "leaflet/dist/leaflet.css";
import { useEffect, useRef, useState } from "react";
import type { Circle, Map as LeafletMap, Marker } from "leaflet";
import { areas, DEFAULT_RADIUS } from "@/lib/coverage";
import { site } from "@/lib/site";

const NAROK: [number, number] = [-1.083, 35.867];

type Point = { lat: number; lng: number } | null;

export default function CoverageMap({
  point,
  selected,
  onPick,
}: {
  point: Point;
  selected?: string;
  onPick: (lat: number, lng: number) => void;
}) {
  const el = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const LRef = useRef<typeof import("leaflet") | null>(null);
  const userRef = useRef<Marker | null>(null);
  const circles = useRef<Record<string, Circle>>({});
  const pick = useRef(onPick);
  pick.current = onPick;
  const [ready, setReady] = useState(false);

  // Build the map once
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const L = (await import("leaflet")).default;
      if (cancelled || !el.current) return;
      LRef.current = L;

      const map = L.map(el.current, { scrollWheelZoom: false }).setView(NAROK, 13);
      mapRef.current = map;

      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(map);

      areas
        .filter((a) => a.lat !== undefined && a.lng !== undefined)
        .forEach((a) => {
          const c = L.circle([a.lat!, a.lng!], {
            radius: a.radius ?? DEFAULT_RADIUS,
            color: "#E0601A",
            weight: 2,
            fillColor: "#F28A2E",
            fillOpacity: 0.22,
          }).addTo(map);
          c.bindTooltip(a.name, { sticky: true });
          circles.current[a.name] = c;
        });

      if (site.office) {
        L.marker([site.office.lat, site.office.lng], {
          title: "Maranet office",
          icon: L.divIcon({ className: "", html: '<span class="hq-pin"></span>', iconSize: [20, 20], iconAnchor: [10, 10] }),
        })
          .addTo(map)
          .bindTooltip("Maranet office");
      }

      const all = Object.values(circles.current);
      if (all.length) map.fitBounds(L.featureGroup(all).getBounds(), { padding: [30, 30] });

      map.on("click", (e) => pick.current(e.latlng.lat, e.latlng.lng));
      setReady(true);
    })();

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
      userRef.current = null;
      circles.current = {};
    };
  }, []);

  // Show and move the "your location" pin
  useEffect(() => {
    const map = mapRef.current;
    const L = LRef.current;
    if (!ready || !map || !L) return;

    if (!point) {
      userRef.current?.remove();
      userRef.current = null;
      return;
    }
    if (!userRef.current) {
      const m = L.marker([point.lat, point.lng], {
        draggable: true,
        title: "Your location",
        icon: L.divIcon({ className: "", html: '<span class="user-pin"></span>', iconSize: [28, 34], iconAnchor: [14, 34] }),
      }).addTo(map);
      m.on("dragend", () => {
        const p = m.getLatLng();
        pick.current(p.lat, p.lng);
      });
      userRef.current = m;
    } else {
      userRef.current.setLatLng([point.lat, point.lng]);
    }
    map.flyTo([point.lat, point.lng], Math.max(map.getZoom(), 15), { duration: 0.6 });
  }, [point, ready]);

  // Zoom to an area picked by name
  useEffect(() => {
    const map = mapRef.current;
    if (!ready || !map || !selected) return;
    const c = circles.current[selected];
    if (c) map.flyToBounds(c.getBounds(), { duration: 0.8, maxZoom: 16 });
  }, [selected, ready]);

  return (
    <div className="relative min-h-[420px] lg:min-h-[560px]">
      <div
        ref={el}
        className="isolate absolute inset-0"
        role="application"
        aria-label="Map of Maranet fibre zones in Narok"
      />

      <div className="pointer-events-none absolute bottom-3 left-3 z-10 space-y-1.5 rounded-2xl bg-white/95 p-3 text-sm shadow-lg">
        <p className="flex items-center gap-2">
          <span className="h-3.5 w-3.5 rounded-full border-2 border-[#E0601A] bg-[#F28A2E]/30" /> Fibre zone
        </p>
        {site.office && (
          <p className="flex items-center gap-2">
            <span className="h-3.5 w-3.5 rounded-full bg-sun ring-2 ring-[#E0601A]" /> Maranet office
          </p>
        )}
        <p className="flex items-center gap-2">
          <span className="h-3.5 w-3.5 rounded-full bg-[#1c1917]" /> Your location
        </p>
      </div>

    </div>
  );
}