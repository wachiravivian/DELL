import { Service } from "@/lib/services";
import { whatsappLink } from "@/lib/site";

export default function ServiceCard({ service }: { service: Service }) {
  const Icon = service.icon;
  return (
    <div className="card group flex h-full flex-col transition duration-300 hover:-translate-y-2 hover:border-sun hover:shadow-[0_20px_40px_rgba(58,36,20,0.12)]">
      <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-sand text-olive transition-colors group-hover:bg-sun group-hover:text-bark">
        <Icon size={30} strokeWidth={2} aria-hidden />
      </span>
      <h2 className="mt-5 text-2xl font-bold">{service.title}</h2>
      <p className="mt-2 flex-1 text-bark-muted">{service.description}</p>
      <a
        href={whatsappLink(`Hello Maranet, I would like to enquire about: ${service.title}`)}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-outline mt-6"
      >
        Enquire on WhatsApp
      </a>
    </div>
  );
}