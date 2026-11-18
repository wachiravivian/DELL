"use client";

import Link from "next/link";
import { useState } from "react";
import { LocateFixed } from "lucide-react";
import CoverageMap from "./CoverageMap";
import { areas, findArea, hasZones, zonesAt } from "@/lib/coverage";
import { whatsappLink } from "@/lib/site";

type Point = { lat: number; lng: number };

export default function CoverageChecker() {
  const [query, setQuery] = useState("");
  const [checked, setChecked] = useState(""); // text that was searched
  const [point, setPoint] = useState<Point | null>(null); // pin on the map
  const [geoMsg, setGeoMsg] = useState("");
  const [selected, setSelected] = useState<string | undefined>();

  const byName = checked ? findArea(checked) : undefined;
  const zones = point ? zonesAt(point.lat, point.lng) : [];
  const gpsText = point ? `${point.lat.toFixed(6)},${point.lng.toFixed(6)}` : "";

  function searchName(value: string) {
    const v = value.trim();
    setQuery(value);
    setChecked(v);
    setPoint(null);
    setGeoMsg("");
    setSelected(findArea(v)?.name);
  }

  function pickPoint(lat: number, lng: number) {
    setPoint({ lat: Number(lat.toFixed(6)), lng: Number(lng.toFixed(6)) });
    setChecked("");
    setQuery("");
    setSelected(undefined);
    setGeoMsg("");
  }

  function locate() {
    if (!navigator.geolocation) {
      setGeoMsg("Your browser can't share your location. Type your area instead.");
      return;
    }
    setGeoMsg("Finding you...");
    navigator.geolocation.getCurrentPosition(
      (p) => pickPoint(p.coords.latitude, p.coords.longitude),
      () => setGeoMsg("We couldn't get your location. Type your area instead."),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  const availableName = point ? zones[0]?.name : byName?.name;
  const available = !!availableName;
  const showResult = point !== null || checked !== "";

  const connectHref = available
    ? `/get-connected/?area=${encodeURIComponent(availableName!)}${gpsText ? `&gps=${gpsText}` : ""}`
    : gpsText
      ? `/get-connected/?gps=${gpsText}`
      : `/get-connected/?area=${encodeURIComponent(checked)}`;

  const whatsappText = available
    ? `Hello Maranet, I am in ${availableName} and would like to get connected.`
    : point
      ? `Hello Maranet, I would like to check coverage at my location: https://www.google.com/maps?q=${gpsText}`
      : `Hello Maranet, I am in ${checked}. Do you cover my area?`;

  return (
    <div className="grid overflow-hidden rounded-3xl border border-line bg-white lg:grid-cols-[0.42fr_0.58fr]">
      <div className="p-6 sm:p-8">
        <p className="text-bark-muted">Is Maranet Solutions available where you are?</p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            searchName(query);
          }}
          className="mt-4 flex gap-3"
        >
          <label htmlFor="area" className="sr-only">Your area</label>
          <input
            id="area"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setChecked("");
            }}
            placeholder="e.g. Lenana, Majengo"
            autoComplete="off"
            className="field min-w-0 flex-1"
          />
          <button type="submit" className="btn-sun">Search</button>
        </form>

        {hasZones && (
          <>
            <button
              type="button"
              onClick={locate}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-sun px-4 py-3 font-bold text-olive transition-colors hover:bg-sand"
            >
              <LocateFixed size={18} aria-hidden /> Use my current location
            </button>
            {geoMsg && <p className="mt-2 text-sm text-bark-soft" aria-live="polite">{geoMsg}</p>}
            <p className="mt-4 text-sm text-bark-soft">
              Tip: tap the map or drag the pin to your exact building for the most accurate result.
            </p>
          </>
        )}

        <div aria-live="polite" className="mt-5">
          {showResult && available && (
            <div className="rounded-2xl border border-olive bg-olive-tint p-5">
              <p className="font-display text-2xl font-bold text-olive">✓ Fibre is available</p>
              <p className="mt-1 text-sm text-bark-soft">📍 {availableName}</p>
              <p className="mt-3">
                {point ? (
                  <>You’re inside our <b>{availableName}</b> fibre zone. </>
                ) : (
                  <>Maranet is available in <b>{availableName}</b>. </>
                )}
                Your exact building is confirmed when we book your free installation.
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-4">
                <Link href={connectHref} className="btn-sun">Request connection</Link>
                <Link href="/packages/" className="font-bold text-olive underline">View packages</Link>
              </div>
            </div>
          )}

          {showResult && !available && (
            <div className="rounded-2xl border border-line bg-sand p-5">
              <p className="font-display text-2xl font-bold">
                {point ? "Not inside a fibre zone yet" : `We don’t see “${checked}” on our list yet`}
              </p>
              <p className="mt-2 text-bark-muted">
                {point
                  ? "Your pin isn’t inside one of our fibre zones yet. Send us your location and our team will check for you."
                  : "Send us your location and our team will check for you."}
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link href={connectHref} className="btn-olive">Send my location</Link>
                <a href={whatsappLink(whatsappText)} target="_blank" rel="noopener noreferrer" className="btn-outline">
                  WhatsApp us
                </a>
              </div>
            </div>
          )}
        </div>

        <details className="mt-6">
          <summary className="cursor-pointer font-bold text-olive">See all {areas.length} areas we cover</summary>
          <div className="mt-3 flex flex-wrap gap-2">
            {areas.map((a) => (
              <button
                key={a.name}
                type="button"
                onClick={() => searchName(a.name)}
                className={`chip transition hover:border-sun ${byName?.name === a.name ? "!border-olive !bg-olive-tint" : ""}`}
              >
                {a.name}
              </button>
            ))}
          </div>
        </details>
      </div>

      <CoverageMap point={point} selected={selected} onPick={pickPoint} />
    </div>
  );
}