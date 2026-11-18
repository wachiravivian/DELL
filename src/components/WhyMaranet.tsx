import Image from "next/image";
import { Gauge, ShieldCheck, Sparkles, Wifi } from "lucide-react";
import Reveal from "./Reveal";

const features = [
  { icon: ShieldCheck, title: "Secure", text: "Safe browsing for peace of mind." },
  { icon: Gauge, title: "Fast", text: "Speeds that keep up with your day." },
  { icon: Wifi, title: "Stable", text: "A reliable connection you can count on." },
  { icon: Sparkles, title: "For everything", text: "Learning, creating, gaming and more." },
];

export default function WhyMaranet() {
  return (
    <section className="py-16 lg:py-20">
      <div className="container-site grid items-center gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="relative mx-auto w-full max-w-[300px]">
          <div aria-hidden className="absolute -bottom-4 -right-4 h-full w-full rounded-t-[999px] rounded-b-3xl bg-sun/30" />
          <div className="relative overflow-hidden rounded-t-[999px] rounded-b-3xl border-4 border-white shadow-xl">
            <Image src="/images/photos/man-laptop.jpg" alt="A man smiling with a laptop" width={238} height={403} className="h-auto w-full" />
          </div>
          <div className="absolute -right-8 bottom-10 max-w-[180px] animate-float rounded-2xl bg-sun px-4 py-3 text-sm font-bold shadow-lg motion-reduce:animate-none">
            Twice the speed. No extra cost.
          </div>
        </div>

        <div>
          <p className="eyebrow">Why Maranet</p>
          <h2 className="mb-3 mt-3 text-3xl font-bold sm:text-4xl">Built for your world</h2>
          <p className="mb-8 max-w-xl text-bark-muted">
            Give your family the speed, stability and security to learn, create, game and achieve more.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <Reveal key={f.title} delay={i * 100} className="h-full">
                  <div className="card group h-full !p-6 transition duration-300 hover:-translate-y-1.5 hover:border-sun hover:shadow-lg">
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-sand text-olive transition-colors group-hover:bg-sun group-hover:text-bark">
                      <Icon size={24} aria-hidden />
                    </span>
                    <h3 className="mb-1 mt-4 text-xl font-bold">{f.title}</h3>
                    <p className="text-bark-muted">{f.text}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}