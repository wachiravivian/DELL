import Link from "next/link";
import Reveal from "./Reveal";
import { services } from "@/lib/services";

export default function ServicesTeaser() {
  return (
    <section className="pb-16 lg:pb-20">
      <div className="container-site">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">What we do</p>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">More than just internet</h2>
          </div>
          <Link href="/services/" className="btn-outline">See all services</Link>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
          {services.map((s, i) => {
            const Icon = s.icon;
            return (
              <Reveal key={s.slug} delay={(i % 5) * 80} className="h-full">
                <Link
                  href="/services/"
                  className="group flex h-full flex-col items-center gap-3 rounded-3xl border border-line bg-white p-5 text-center transition duration-300 hover:-translate-y-1.5 hover:border-sun hover:shadow-lg"
                >
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sand text-olive transition-colors group-hover:bg-sun group-hover:text-bark">
                    <Icon size={26} aria-hidden />
                  </span>
                  <span className="font-bold leading-snug">{s.title}</span>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}