import { site, whatsappLink } from "@/lib/site";

export default function MobileActionBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 gap-3 border-t border-line bg-cream/95 p-3 backdrop-blur md:hidden">
      <a href={`tel:${site.phone}`} className="btn-olive">Call us</a>
      <a
        href={whatsappLink("Hello Maranet, I would like to get connected.")}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-sun"
      >
        WhatsApp
      </a>
    </div>
  );
}