import Image from "next/image";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { site, whatsappLink } from "@/lib/site";

const explore = [
  { label: "Home", href: "/" },
  { label: "Packages", href: "/packages/" },
  { label: "Services", href: "/services/" },
  { label: "Contact", href: "/contact/" },
  { label: "About us", href: "/about/" },
  { label: "Get connected", href: "/get-connected/" },
];

const selfcare = [
  { label: "How to pay", href: "/support/#pay" },
  { label: "Support", href: "/support/" },
  { label: "Contact us", href: "/contact/" },
];

function FooterLink({ href, label }: { href: string; label: string }) {
  // Links with a # use a plain link, so the right tab opens even when already on that page
  return href.includes("#") ? (
    <a href={href} className="hover:underline">{label}</a>
  ) : (
    <Link href={href} className="hover:underline">{label}</Link>
  );
}

export default function Footer() {
  return (
    <footer className="bg-olive text-white">
      <div className="container-site grid gap-6 py-8 sm:grid-cols-2 lg:grid-cols-[1.3fr_0.8fr_0.8fr_1.4fr]">
        <div>
          <Link href="/" aria-label="Maranet home" className="inline-block rounded-xl bg-cream px-3 py-2">
            <Image
              src="/images/maranet-logo.png"
              alt="Maranet – The People's net"
              width={404}
              height={201}
              className="h-10 w-auto"
            />
          </Link>
          <p className="mt-3 max-w-xs text-sm text-white/90">{site.tagline}</p>

        </div>

        <div>
          <p className="text-sm font-bold">Explore</p>
          <ul className="mt-2 space-y-1 text-sm">
            {explore.map((l) => (
              <li key={l.href}><FooterLink {...l} /></li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm font-bold">Self-care</p>
          <ul className="mt-2 space-y-1 text-sm">
            {selfcare.map((l) => (
              <li key={l.href}><FooterLink {...l} /></li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm font-bold">Visit or contact us</p>
          <address className="mt-2 space-y-0.5 text-sm not-italic leading-snug">
            <span className="block">{site.address.join(", ")}</span>
            <span className="block">
              Call: <a href={`tel:${site.phone}`} className="hover:underline">{site.phoneDisplay}</a>
              {" · "}
              <a href={`tel:${site.phoneAlt}`} className="hover:underline">{site.phoneAltDisplay}</a>
            </span>
            <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:underline">
              <MessageCircle size={16} aria-hidden="true" />
              WhatsApp & SMS only: {site.whatsappDisplay}
            </a>
            {site.social.map((s) => (
              <span key={s.label} className="block">
                Follow us on Instagram:{" "}
                <a href={s.href} target="_blank" rel="noopener noreferrer" className="font-bold hover:underline">
                  {s.label}
                </a>
              </span>
            ))}
            <a href={`mailto:${site.email}`} className="block hover:underline">{site.email}</a>
          </address>
        </div>
      </div>

      <div className="border-t border-white/20">
        <div className="container-site flex flex-wrap items-center justify-between gap-2 py-3 text-xs text-white/90">
          <span>© {new Date().getFullYear()} {site.name}. All rights reserved.</span>
          <span>
            Pay via M-PESA Paybill <b>{site.paybill}</b>
          </span>
        </div>
      </div>
    </footer>
  );
}