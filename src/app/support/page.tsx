import type { Metadata } from "next";
import SupportTabs from "@/components/SupportTabs";
import { site, whatsappLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Support – Maranet",
  description:
    "Pay your Maranet bill, get help with your connection or send an enquiry. Call, WhatsApp, email or visit us at Upper-Lenana Junction, Narok.",
};

export default function SupportPage() {
  return (
    <main>
      <section className="bg-sand py-8 lg:py-10">
        <div className="container-site">
          <p className="eyebrow">Support</p>
          <h1 className="mb-2 mt-2 text-4xl font-bold sm:text-5xl">We’re here to help</h1>
          <p className="max-w-2xl text-lg text-bark-muted">
            Pay your bill, report a problem or ask a question. Choose what you need.
          </p>
        </div>
      </section>

      <section className="container-site grid gap-10 pb-16 pt-10 lg:grid-cols-[0.9fr_1.1fr] lg:pb-20">
        <div className="space-y-6">
          <div className="card space-y-5">
            <div>
              <p className="eyebrow">Call us directly</p>
              <a href={`tel:${site.phone}`} className="block text-xl font-bold hover:underline">{site.phoneDisplay}</a>
            </div>
            <div>
              <p className="eyebrow">Alternative number</p>
              <a href={`tel:${site.phoneAlt}`} className="block text-xl font-bold hover:underline">{site.phoneAltDisplay}</a>
            </div>
            <div>
              <p className="eyebrow">WhatsApp & SMS only</p>
              <p className="text-xl font-bold">{site.whatsappDisplay}</p>
              <p className="text-bark-soft">For messages and quick chat support</p>
            </div>
            <div>
              <p className="eyebrow">Email</p>
              <a href={`mailto:${site.email}`} className="block text-xl font-bold hover:underline">{site.email}</a>
            </div>
            <div>
              <p className="eyebrow">Visit us</p>
              <address className="not-italic">
                {site.address.map((l) => (
                  <span key={l} className="block text-lg">{l}</span>
                ))}
              </address>
            </div>
            <a
              href={whatsappLink("Hello Maranet, I need support.")}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-sun w-full"
            >
              Chat on WhatsApp
            </a>
          </div>

          <div className="overflow-hidden rounded-3xl border border-line">
            <iframe
              title="Maranet office location"
              src="https://www.google.com/maps?q=Upper+Lenana+Junction+Narok&output=embed"
              className="h-72 w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        <SupportTabs />
      </section>
    </main>
  );
}