import type { Metadata } from "next";
import CoverageChecker from "@/components/CoverageChecker";
import CtaBand from "@/components/CtaBand";

export const metadata: Metadata = {
  title: "Coverage – Maranet",
  description: "Check if Maranet fibre internet is available in your area of Narok County.",
};

export default function CoveragePage() {
  return (
    <main>
      <section className="bg-sand py-8 lg:py-10">
        <div className="container-site">
          <p className="eyebrow">Coverage</p>
          <h1 className="mb-2 mt-2 text-4xl font-bold sm:text-5xl">Is Maranet in your area?</h1>
          <p className="max-w-2xl text-lg text-bark-muted">Type your area or tap it on the map to find out.</p>
        </div>
      </section>

      <section className="container-site pb-16 pt-10 lg:pb-20">
        <CoverageChecker />
      </section>

      <CtaBand />
    </main>
  );
}