"use client";

import { useEffect, useRef, useState } from "react";
import LogoMark from "./LogoMark";

export default function HeroPhoto({ src, alt }: { src: string; alt: string }) {
  const ref = useRef<HTMLImageElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const img = ref.current;
    if (img && img.complete && img.naturalWidth === 0) setFailed(true);
  }, []);

  if (failed) {
    return (
      <div className="flex aspect-[4/5] w-full items-center justify-center bg-cream">
        <LogoMark className="w-3/5" />
      </div>
    );
  }

  // eslint-disable-next-line @next/next/no-img-element
  return (
    <img
      ref={ref}
      src={src}
      alt={alt}
      className="aspect-[4/5] w-full object-cover object-[50%_top]"
      onError={() => setFailed(true)}
    />
  );
}