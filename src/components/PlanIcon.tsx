"use client";

import { useEffect, useRef, useState } from "react";
import { GraduationCap } from "lucide-react";

export default function PlanIcon({ src, className = "" }: { src: string; className?: string }) {
  const ref = useRef<HTMLImageElement>(null);
  const [failed, setFailed] = useState(false);

  // Catches images that failed before React finished loading
  useEffect(() => {
    const img = ref.current;
    if (img && img.complete && img.naturalWidth === 0) setFailed(true);
  }, []);

  if (src === "builtin:graduation") {
    return <GraduationCap className={className} color="#4F6B2B" strokeWidth={1.75} aria-hidden />;
  }

  if (failed) {
    return (
      <svg viewBox="0 0 64 64" className={className} fill="none" strokeLinecap="round" aria-hidden>
        <path d="M10 28a31 31 0 0 1 44 0" stroke="#F28A2E" strokeWidth="6" />
        <path d="M18 37a20 20 0 0 1 28 0" stroke="#5E7D37" strokeWidth="6" />
        <circle cx="32" cy="48" r="5" fill="#3A2414" />
      </svg>
    );
  }

  // eslint-disable-next-line @next/next/no-img-element
  return <img ref={ref} src={src} alt="" width={56} height={56} className={className} onError={() => setFailed(true)} />;
}