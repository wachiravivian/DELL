"use client";

import Image from "next/image";
import { useState } from "react";
import { Check, X } from "lucide-react";

const content = {
  without: [
    "Slow and interrupted connections",
    "Missed opportunities",
    "Frustration and wasted time",
    "Limited access to online services",
  ],
  with: [
    "Fast, stable and uninterrupted connection",
    "Seamless learning and remote work",
    "More productivity and more opportunities",
    "Easy access to everything online",
  ],
};

export default function OnlineOffline() {
  const [mode, setMode] = useState<"with" | "without">("with");
  const good = mode === "with";

  const tab = (m: "with" | "without", label: string, active: string) => (
    <button
      type="button"
      role="tab"
      aria-selected={mode === m}
      onClick={() => setMode(m)}
      className={`rounded-full px-5 py-2.5 font-bold transition-colors ${mode === m ? active : "text-bark hover:bg-sand"}`}
    >
      {label}
    </button>
  );

  return (
    <section className="bg-sand py-16 lg:py-20">
      <div className="container-site grid items-center gap-10 lg:grid-cols-2">
        <div className="overflow-hidden rounded-3xl border border-line bg-white shadow-lg">
          <Image
            src="/images/photos/online-vs-offline.jpg"
            alt="A laptop showing Connecting on one side and You're online on the other, beside a Maranet router"
            width={510}
            height={238}
            className={`h-auto w-full transition duration-700 ${good ? "" : "grayscale brightness-90"}`}
          />
        </div>

        <div>
          <p className="eyebrow">Why it matters</p>
          <h2 className="mb-6 mt-3 text-3xl font-bold sm:text-4xl">Reliable internet. Better life.</h2>

          <div role="tablist" className="inline-flex flex-wrap gap-1 rounded-full border border-line bg-white p-1">
            {tab("without", "Without reliable internet", "bg-bark text-white")}
            {tab("with", "With reliable internet", "bg-olive text-white")}
          </div>

          <ul key={mode} className="mt-6 space-y-3">
            {content[mode].map((t, i) => (
              <li key={t} className="fade-up flex items-center gap-3 text-lg" style={{ animationDelay: `${i * 80}ms` }}>
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                    good ? "bg-olive text-white" : "bg-red-100 text-red-700"
                  }`}
                >
                  {good ? <Check size={16} aria-hidden /> : <X size={16} aria-hidden />}
                </span>
                {t}
              </li>
            ))}
          </ul>

          <p className="mt-8 font-display text-xl font-bold text-olive">That’s Maranet.</p>
        </div>
      </div>
    </section>
  );
}