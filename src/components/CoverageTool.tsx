"use client";

import "leaflet/dist/leaflet.css";
import { useEffect, useRef, useState } from "react";
import type { Circle, Map as LeafletMap } from "leaflet";
import { areas } from "@/lib/coverage";

type Entry = { lat: number; lng: number; radius: number };

export default function CoverageTool() {
  const el = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const LRef = useRef<typeof import("leaflet") | null>(null);
  const layers = useRef<Record<string, Circle>>({});
  const [ready, setReady] = useState(false);

  const [name, setName] = useState(areas[0].name);
  const [radius, setRadius] = useState(700);
  const [entries, setEntries] = useState<Record<string, Entry>>(() =>
    Object.fromEntries(
      areas
        .filter((a) => a.lat !== undefined && a.lng !== undefined)
        .map((a) => [a.name, { lat: a.lat!, lng: a.lng!, radius: a.radius ?? 600 }])
    )
  );
  const [copied, setCopied] = useState(false);

  const nameRef = useRef(name);
  nameRef.current = name;
  const radiusRef = useRef(radius);
  radiusRef.current = radius;

  // Build the map once
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const L = (await import("leaflet")).default;
      if (cancelled || !el.current) return;
      LRef.current = L;

      const map = L.map(el.current).setView([-1.083, 35.867], 13);
      mapRef.current = map;
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(map);

      // Clicking the map places the chosen area there
      map.on("click", (e) => {
        setEntries((prev) => ({
          ...prev,
          [nameRef.current]: {
            lat: Number(e.latlng.lat.toFixed(5)),
            lng: Number(e.latlng.lng.toFixed(5)),
            radius: radiusRef.current,
          },
        }));
      });
      setReady(true);
    })();

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
      layers.current = {};
    };
  }, []);

  // Draw a circle for every area that has been placed
  useEffect(() => {
    const map = mapRef.current;
    const L = LRef.current;
    if (!ready || !map || !L) return;
    Object.entries(entries).forEach(([n, e]) => {
      let c = layers.current[n];
      if (!c) {
        c = L.circle([e.lat, e.lng], {
          radius: e.radius,
          color: "#E0601A",
          weight: 2,
          fillColor: "#F28A2E",
          fillOpacity: 0.25,
          interactive: false,
        }).addTo(map);
        c.bindTooltip(n, { permanent: true, direction: "center" });
        layers.current[n] = c;
      } else {
        c.setLatLng([e.lat, e.lng]);
        c.setRadius(e.radius);
      }
    });
  }, [entries, ready]);

  const changeRadius = (r: number) => {
    setRadius(r);
    if (entries[name]) setEntries({ ...entries, [name]: { ...entries[name], radius: r } });
  };

  const changeName = (n: string) => {
    setName(n);
    const e = entries[n];
    if (e) {
      setRadius(e.radius);
      mapRef.current?.flyTo([e.lat, e.lng], 15);
    }
  };

  const lines = areas
    .map((a) => {
      const e = entries[a.name];
      const parts = [`name: ${JSON.stringify(a.name)}`];
      if (a.aliases?.length) parts.push(`aliases: ${JSON.stringify(a.aliases)}`);
      if (e) parts.push(`lat: ${e.lat}`, `lng: ${e.lng}`, `radius: ${e.radius}`);
      return `  { ${parts.join(", ")} },`;
    })
    .join("\n");
  const output = `export const areas: Area[] = [\n${lines}\n];`;
  const done = Object.keys(entries).length;

  return (
    <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
      <div className="space-y-5">
        <div>
          <label className="label" htmlFor="t-area">1. Choose an area</label>
          <select id="t-area" value={name} onChange={(e) => changeName(e.target.value)} className="field">
            {areas.map((a) => (
              <option key={a.name} value={a.name}>
                {entries[a.name] ? "✓ " : ""}{a.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="label" htmlFor="t-radius">2. Zone size (radius): {radius} metres</label>
          <input
            id="t-radius"
            type="range"
            min={200}
            max={2000}
            step={50}
            value={radius}
            onChange={(e) => changeRadius(Number(e.target.value))}
            className="w-full accent-[#F28A2E]"
          />
        </div>

        <p className="font-medium">
          3. Click the map in the <b>middle</b> of that area. Placed so far: {done} of {areas.length}.
          Click again to move it, or use the slider to resize it.
        </p>

        <div>
          <label className="label" htmlFor="t-out">4. When done, copy this</label>
          <textarea id="t-out" readOnly value={output} rows={12} className="field py-3 font-mono text-xs" />
          <button
            type="button"
            className="btn-sun mt-2"
            onClick={async () => {
              await navigator.clipboard.writeText(output);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-line">
        <div ref={el} className="isolate h-[620px] w-full" />
      </div>
    </div>
  );
}