import Link from "next/link";
import PlanIcon from "./PlanIcon";
import { Plan, formatKSH } from "@/lib/plans";

const TOP_SPEED = 80; // the fastest plan fills the whole bar

export default function PlanCard({ plan }: { plan: Plan }) {
  const pct = Math.round((plan.speed / TOP_SPEED) * 100);

  return (
    <div className="card group flex h-full flex-col border-t-4 border-t-sun transition duration-300 hover:-translate-y-2 hover:border-sun hover:shadow-[0_20px_40px_rgba(58,36,20,0.12)]">
      <div className="flex items-center justify-between">
        {plan.tier ? <span className="chip !py-1.5">{plan.tier}</span> : <span />}
        <span className="flex h-20 w-20 items-center justify-center rounded-full bg-sand transition-colors group-hover:bg-sun-soft/60">
          <PlanIcon
            src={plan.icon}
            className="h-14 w-14 animate-float object-contain motion-reduce:animate-none"
          />
        </span>
      </div>

      <p className="mt-4 font-display text-5xl font-bold">
        {plan.speed}
        <span className="text-2xl"> Mbps</span>
      </p>

      <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-sand" aria-hidden>
        <div className="bar h-full rounded-full bg-sun" style={{ "--w": `${pct}%` } as React.CSSProperties} />
      </div>

      <p className="mb-5 mt-4">
  <b className="text-2xl">{formatKSH(plan.price)}</b> {plan.period ?? "/month"}
</p>

      <ul className="flex-1 space-y-2">
        {plan.features.map((item) => (
          <li key={item} className="relative pl-7">
            <span
              className="absolute left-0 top-2 h-[7px] w-3 -rotate-45 border-b-[3px] border-l-[3px] border-olive-light"
              aria-hidden
            />
            {item}
          </li>
        ))}
      </ul>

      <Link href={`/get-connected/?plan=${plan.slug}`} className="btn-sun mt-6">
        Get started
      </Link>
    </div>
  );
}