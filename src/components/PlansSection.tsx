import PlanCard from "./PlanCard";
import Reveal from "./Reveal";
import { plans } from "@/lib/plans";
import { site } from "@/lib/site";

export default function PlansSection() {
  return (
    <section id="packages" className="py-16 lg:py-20">
      <div className="container-site">
        <p className="eyebrow">Internet packages</p>
        <h2 className="mb-3 mt-3 text-3xl font-bold sm:text-4xl">Pick the speed that fits you</h2>
        <p className="mb-10 max-w-2xl text-bark-muted">
          From streaming and gaming at home to a full office or institution.
        </p>
        <div className="grid gap-6 sm:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {plans.map((p, i) => (
            <Reveal key={p.slug} delay={i * 120} className="h-full">
              <PlanCard plan={p} />
            </Reveal>
          ))}
        </div>
        <p className="mt-8 text-center font-medium text-bark-muted">
          Installation is free. Router: {site.routerPrice} one-off.
        </p>
      </div>
    </section>
  );
}