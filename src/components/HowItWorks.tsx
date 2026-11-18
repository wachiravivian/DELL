import { ClipboardList, PhoneCall, Wifi, Wrench } from "lucide-react";
import Reveal from "./Reveal";
import { site } from "@/lib/site";

const steps = [
  { icon: ClipboardList, title: "Request", text: "Tell us where you are and which plan you want." },
  { icon: PhoneCall, title: "We confirm", text: "Our team calls you to confirm your details." },
  { icon: Wrench, title: "Installation", text: `Your router costs ${site.routerPrice}.` },
  { icon: Wifi, title: "You're online", text: "Enjoy fast, stable internet with 24/7 support." },
];

export default function HowItWorks() {
  return (
    <div>
      {/* Wavy top edge */}
      <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className="-mb-px block h-10 w-full sm:h-16" aria-hidden>
        <path d="M0 40 C240 90 480 0 720 40 S1200 80 1440 30 V80 H0 Z" fill="#F6EBD8" />
      </svg>

      <section className="bg-sand pb-16 pt-6">
        <div className="container-site">
          <p className="eyebrow">How it works</p>
          <h2 className="mb-12 mt-3 text-3xl font-bold sm:text-4xl">Online in four simple steps</h2>

          <div className="relative grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <div aria-hidden className="absolute left-8 right-8 top-8 hidden border-t-2 border-dashed border-sun lg:block" />
            {steps.map((s, i) => {
              const Icon = s.icon;
              return (
                <Reveal key={s.title} delay={i * 120}>
                  <div className="group relative">
                    <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-sun text-bark shadow-md transition duration-300 group-hover:-translate-y-1 group-hover:scale-110">
                      <Icon size={28} aria-hidden />
                      <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-olive text-xs font-bold text-white">
                        {i + 1}
                      </span>
                    </div>
                    <h3 className="mb-1.5 mt-4 text-xl font-bold">{s.title}</h3>
                    <p>{s.text}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}