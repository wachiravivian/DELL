"use client";

import { useEffect, useRef, useState } from "react";

function CountUp({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [n, setN] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setN(to);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const duration = 1200;
        const tick = (now: number) => {
          const p = Math.min((now - start) / duration, 1);
          setN(Math.round(to * (1 - Math.pow(1 - p, 3))));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [to]);

  return (
    <span ref={ref}>
      {n}
      {suffix}
    </span>
  );
}

const stats = [
  { big: <CountUp to={80} suffix=" Mbps" />, label: "Top speed" },
  { big: "24/7", label: "Customer support" },
  { big: "Installation", label: "Your router costs KSH 2,000." },
  { big: "#1", label: "Narok internet provider" },
];

export default function StatsStrip() {
  return (
    <section className="container-site relative z-10 pb-10 pt-4">
      <div className="grid grid-cols-2 gap-y-8 rounded-3xl bg-olive px-6 py-8 text-center text-white sm:px-10 lg:grid-cols-4 lg:divide-x lg:divide-white/20">
        {stats.map((s) => (
          <div key={s.label}>
            <p className="font-display text-4xl font-bold sm:text-5xl">{s.big}</p>
            <span className="mx-auto mt-2 block h-1 w-8 rounded-full bg-sun" />
            <p className="mt-2 text-sm font-medium text-white/90 sm:text-base">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}