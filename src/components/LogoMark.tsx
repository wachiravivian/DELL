export default function LogoMark({ className = "", animated = false }: { className?: string; animated?: boolean }) {
  const a = (n: number) => (animated ? `mark-${n}` : undefined);
  return (
    <svg viewBox="0 0 120 86" className={className} role="img" aria-label="Maranet">
      <path
        className={a(1)}
        d="M60 4 L35.54 27.62 A34 34 0 0 0 84.46 27.62 Z"
        fill="#3A2414" stroke="#3A2414" strokeWidth="2" strokeLinejoin="round"
      />
      <path
        className={a(2)}
        d="M19.72 42.90 A56 56 0 0 0 100.28 42.90 L93.09 35.96 A46 46 0 0 1 26.91 35.96 Z"
        fill="#5E7D37" stroke="#5E7D37" strokeWidth="2" strokeLinejoin="round"
      />
      <path
        className={a(3)}
        d="M2.45 59.57 A80 80 0 0 0 117.55 59.57 L108.91 51.24 A68 68 0 0 1 11.09 51.24 Z"
        fill="#F28A2E" stroke="#F28A2E" strokeWidth="2" strokeLinejoin="round"
      />
    </svg>
  );
}