import type { Metadata } from "next";
import Link from "next/link";
import PlanCard from "@/components/PlanCard";
import Reveal from "@/components/Reveal";
import { plans } from "@/lib/plans";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Internet packages – Maranet",
  description:
    "Maranet fibre internet packages in Narok from 10 to 80 Mbps. Free installation and 24/7 support.",
};

const included = [
  "Free installation",
  `Router: ${site.routerPrice} one-off`,
  "24/7 support",
];
const faqs = [
  { q: "Do I need to buy a router?", a: `Yes. The router is a one-off purchase of ${site.routerPrice}.` },
  {
    q: "Which plan should I choose?",
    a: "Choose the speed that fits how many people and devices share your connection. Not sure? Call us and we will help you choose.",
  },
  { q: "How do I get connected?", a: "Choose a plan and fill in the installation form. Our team will call you to confirm your details." },
  { q: "What if I have a problem with my connection?", a: "Send a support request, call or message us on WhatsApp. Support is available 24/7." },
];

export default function PackagesPage() {
  return (
    <main>
      <section className="bg-sand py-8 lg:py-10">
  <div className="container-site">
    <p className="eyebrow">Internet packages</p>
    <h1 className="mb-2 mt-2 text-4xl font-bold sm:text-5xl">Pick the speed that fits you</h1>
          <p className="max-w-2xl text-lg text-bark-muted">
            From streaming and gaming at home to a full office or institution.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            {included.map((t) => (
              <span key={t} className="chip">
                <span className="h-2.5 w-2.5 rounded-full bg-sun" />
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-16 pt-8 lg:pb-20 lg:pt-10">
        <div className="container-site">
          <div className="grid gap-6 sm:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {plans.map((p, i) => (
              <Reveal key={p.slug} delay={i * 120} className="h-full">
                <PlanCard plan={p} />
              </Reveal>
            ))}
          </div>
          <p className="mt-8 text-center font-medium text-bark-muted">
            Need something bigger, such as dedicated capacity or a custom setup?{" "}
            <Link href="/services/" className="font-bold text-olive underline">See our services</Link> or{" "}
            <Link href="/contact/" className="font-bold text-olive underline">contact us</Link>.
          </p>
        </div>
      </section>
      <section className="pb-8 pt-8 lg:pb-20 lg:pt-8">
        <div className="container-site max-w-3xl">
          <p className="eyebrow">Questions</p>
          <h2 className="mb-8 mt-3 text-3xl font-bold sm:text-4xl">Good to know</h2>
          <div className="space-y-3">
            {faqs.map((f) => (
              <details key={f.q} className="card group !p-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-bold">
                  {f.q}
                  <span className="text-2xl text-sun transition-transform group-open:rotate-45" aria-hidden>+</span>
                </summary>
                <p className="mt-3 text-bark-muted">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}