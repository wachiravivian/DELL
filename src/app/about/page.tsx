import type { Metadata } from "next";
import { Award, Lightbulb, ShieldCheck, Sprout, Users } from "lucide-react";
import Reveal from "@/components/Reveal";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Vision, Mission and Core Values – Maranet",
  description:
    "Maranet Solutions: our vision, mission and core values. Our shared purpose, direction and commitments guide how we work, serve our customers and build partnerships.",
};

const values = [
  { icon: Award, title: "Excellence", text: "We do our work well and deliver exceptional service." },
  { icon: ShieldCheck, title: "Integrity", text: "We act honestly, keep our promises and take responsibility." },
  { icon: Lightbulb, title: "Innovation", text: "We embrace ideas and find better ways to work and serve." },
  { icon: Users, title: "Collaboration", text: "We listen, support one another and work towards shared goals." },
  { icon: Sprout, title: "Empowerment", text: "We share knowledge and create opportunities for people to grow." },
];

export default function AboutPage() {
  return (
    <main>
      <section className="bg-sand py-8 lg:py-10">
        <div className="container-site">
          <p className="eyebrow">Maranet Solutions</p>
          <h1 className="mb-2 mt-2 text-4xl font-bold sm:text-5xl">Vision, Mission and Core Values</h1>
          <p className="max-w-2xl text-lg text-bark-muted">
            Our shared purpose, direction and commitments guide how we work, serve our customers and build partnerships.
          </p>
        </div>
      </section>

      <section className="container-site py-12 lg:py-16">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="card">
            <p className="eyebrow">Vision</p>
            <p className="mt-3 font-display text-2xl font-bold sm:text-3xl">
              An Africa where every community thrives in a digital world.
            </p>
          </div>
          <div className="card">
            <p className="eyebrow">Mission</p>
            <p className="mt-3 font-display text-2xl font-bold sm:text-3xl">
              To empower communities and businesses through connectivity and technology.
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-3xl bg-olive p-8 text-center text-white sm:p-10">
          <p className="text-sm font-bold uppercase tracking-[0.12em] text-white/80">Tagline</p>
          <p className="mt-2 font-display text-2xl font-bold sm:text-3xl">{site.slogan}</p>
        </div>

        <p className="eyebrow mt-14">Core values</p>
        <h2 className="mb-8 mt-3 text-3xl font-bold sm:text-4xl">What we stand for</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {values.map((v, i) => {
            const Icon = v.icon;
            return (
              <Reveal key={v.title} delay={(i % 3) * 100} className="h-full">
                <div className="card group h-full transition duration-300 hover:-translate-y-1.5 hover:border-sun hover:shadow-lg">
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sand text-olive transition-colors group-hover:bg-sun group-hover:text-bark">
                    <Icon size={26} aria-hidden />
                  </span>
                  <h3 className="mb-1 mt-5 text-xl font-bold">{v.title}</h3>
                  <p className="text-bark-muted">{v.text}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>
    </main>
  );
}