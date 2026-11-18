import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import ServiceCard from "@/components/ServiceCard";
import CtaBand from "@/components/CtaBand";
import { services } from "@/lib/services";

export const metadata: Metadata = {
  title: "Services – Maranet",
  description:
    "Home and business fibre, CDN local caches, co-location, L2 transport, dedicated internet, SIP trunk, solar, event Wi-Fi and networking from Maranet in Narok.",
};

export default function ServicesPage() {
  return (
    <main>
      <section className="bg-sand py-8 lg:py-10">
        <div className="container-site">
          <p className="eyebrow">Our services</p>
          <h1 className="mb-2 mt-2 text-4xl font-bold sm:text-5xl">Connectivity and more, for Narok</h1>
          <p className="max-w-2xl text-lg text-bark-muted">
            From home internet to dedicated capacity, voice and networking, everything you need to stay connected.
          </p>
        </div>
      </section>

      <section className="pb-16 pt-8 lg:pb-20 lg:pt-10">
        <div className="container-site grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <Reveal key={s.slug} delay={(i % 3) * 120} className="h-full">
              <ServiceCard service={s} />
            </Reveal>
          ))}
        </div>
      </section>

      <CtaBand />
    </main>
  );
}