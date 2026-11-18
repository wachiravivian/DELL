import type { Metadata } from "next";
import Image from "next/image";
import ContactCard from "@/components/ContactCard";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Maranet Solutions | Connect",
  description:
    "Connect with Maranet Solutions for internet connectivity and ICT solutions. Call, WhatsApp, email, save our contact or request a consultation.",
};

export default function ContactPage() {
  return (
    <main className="container-site py-6 lg:py-10">
      <div className="mx-auto max-w-md overflow-hidden rounded-3xl border border-line bg-white shadow-[0_18px_40px_rgba(58,36,20,0.12)]">
        <header className="flex items-center gap-4 bg-olive px-5 py-4 text-white">
          <span className="shrink-0 rounded-xl bg-cream px-3 py-2">
            <Image
              src="/images/maranet-logo.png"
              alt="Maranet – The People's net"
              width={404}
              height={201}
              priority
              className="h-11 w-auto"
            />
          </span>
          <div>
            <h1 className="text-xl font-bold leading-tight">Maranet Solutions</h1>
            <p className="text-sm text-white/90">{site.slogan}</p>
          </div>
        </header>

        <section className="p-5">
          <p className="mb-3 text-center text-sm font-medium text-bark-muted">
            Internet Connectivity &amp; ICT Solutions
          </p>
          <ContactCard />
          <p className="mt-4 text-center text-xs leading-relaxed text-bark-soft">
            Internet Connectivity · Networking Solutions · CCTV &amp; Surveillance · Internal Communication Systems ·
            ICT Infrastructure Rehabilitation
          </p>
        </section>
      </div>
    </main>
  );
}