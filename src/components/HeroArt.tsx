import { formatKSH, plans } from "@/lib/plans";
import HeroPhoto from "./HeroPhoto";
import { site } from "@/lib/site";

const lowest = Math.min(...plans.filter((p) => !p.period).map((p) => p.price));

export default function HeroArt() {
  return (
    <div className="relative mx-auto w-full max-w-[340px] py-6">
      {/* Pulsing signal rings behind the photo */}
      <div aria-hidden className="absolute left-1/2 top-1/2 h-[115%] w-[115%] -translate-x-1/2 -translate-y-1/2">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="absolute inset-0 animate-ring rounded-full border-4 border-sun/40 motion-reduce:animate-none"
            style={{ animationDelay: `${i}s` }}
          />
        ))}
      </div>

      {/* Photo in an arch frame */}
      <div className="relative">
        <div aria-hidden className="absolute -bottom-4 -right-4 h-full w-full rounded-t-[999px] rounded-b-3xl bg-sun/30" />
        <div className="relative overflow-hidden rounded-t-[999px] rounded-b-3xl border-4 border-white shadow-xl">
          <HeroPhoto src={site.heroPhoto} alt={site.heroPhotoAlt} />
        </div>
      </div>

      {/* Floating badges */}
      <div className="absolute -bottom-2 -left-6 animate-float rounded-2xl border border-line bg-white px-5 py-3 shadow-lg motion-reduce:animate-none sm:-left-12">
        <p className="eyebrow">Plans from</p>
        <p className="font-display text-2xl font-bold">
          {formatKSH(lowest)}
          <span className="text-sm font-medium text-bark-soft"> /month</span>
        </p>
      </div>
      <div className="absolute -left-4 top-1/3 hidden animate-float rounded-full bg-white px-4 py-2 text-sm font-bold shadow-lg [animation-delay:-2.5s] motion-reduce:animate-none sm:-left-10 sm:block">
        24/7 support
      </div>
    </div>
  );
}