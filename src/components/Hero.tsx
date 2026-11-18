import Link from "next/link";
import HeroArt from "./HeroArt";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Soft drifting colour shapes */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 top-10 h-72 w-72 animate-drift rounded-full bg-sun/20 blur-3xl motion-reduce:animate-none"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 bottom-0 h-80 w-80 animate-drift rounded-full bg-olive-light/20 blur-3xl [animation-delay:-7s] motion-reduce:animate-none"
      />

      <div className="container-site relative grid items-center gap-12 py-10 lg:grid-cols-[1.05fr_0.95fr] lg:py-16">
        <div>
          <p className="eyebrow">Narok's fibre internet provider</p>
          <h1 className="mb-5 mt-4 text-4xl font-bold leading-[1.05] sm:text-5xl lg:text-6xl">
            Fast, reliable fibre for the people of Narok.
          </h1>
          <p className="max-w-xl text-lg text-bark-muted">
            Home, business and institution plans with support whenever you need it.
          </p>

          <div className="my-8 flex flex-wrap gap-4">
            <Link href="/get-connected/" className="btn-sun">Get connected</Link>
<Link href="/coverage/" className="btn-olive">Check coverage</Link>          </div>

          <div className="flex flex-wrap gap-3">
            {["#1 Narok Internet Provider", "24/7 support"].map((t) => (
              <span key={t} className="chip">
                <span className="h-2.5 w-2.5 rounded-full bg-sun" />
                {t}
              </span>
            ))}
          </div>
        </div>

        <HeroArt />
      </div>
    </section>
  );
}