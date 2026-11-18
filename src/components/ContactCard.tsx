"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { ClipboardList, Globe, Mail, MessageCircle, Phone, UserPlus } from "lucide-react";
import Field from "./forms/Field";
import { isValidPhone } from "@/lib/validation";
import { site, whatsappLink } from "@/lib/site";

const services = [
  "Internet Connectivity",
  "Networking Solutions",
  "CCTV & Surveillance",
  "Internal Communication Systems",
  "ICT Infrastructure Rehabilitation",
  "Other",
];

type Errors = Partial<Record<"person" | "phone" | "service", string>>;

const tile =
  "flex flex-col gap-0.5 rounded-xl border border-line bg-white px-3 py-2.5 transition-colors hover:border-sun hover:bg-cream";
const tileTitle = "flex items-center gap-2 font-bold text-olive";
const tileDetail = "truncate text-xs text-bark-soft";

export default function ContactCard() {
  const [open, setOpen] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [link, setLink] = useState("");

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const v = (k: string) => String(fd.get(k) ?? "").trim();

    const errs: Errors = {};
    if (v("person").length < 2) errs.person = "Please enter the contact person’s name.";
    if (!isValidPhone(v("phone"))) errs.phone = "Enter a valid phone number, for example 0703 666 999.";
    if (!v("service")) errs.service = "Please choose a service.";
    setErrors(errs);
    if (Object.keys(errs).length) return;

    const text = [
      "Hello Maranet, I would like to request a consultation.",
      `Business/Institution: ${v("business")}`,
      `Contact person: ${v("person")}`,
      `Phone: ${v("phone")}`,
      `Service of interest: ${v("service")}`,
      `Brief requirements: ${v("details")}`,
    ].join("\n");

    const url = whatsappLink(text);
    setLink(url);
    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="space-y-2.5">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls="consult-form"
        className="btn-sun w-full gap-2"
      >
        <ClipboardList size={20} aria-hidden />
        Request a Consultation
      </button>

      {open && (
        <form id="consult-form" onSubmit={onSubmit} noValidate className="space-y-3 rounded-2xl border border-line bg-cream p-4">
          <Field label="Business or institution name" htmlFor="c-business">
            <input id="c-business" name="business" type="text" autoComplete="organization" className="field" />
          </Field>
          <Field label="Contact person" htmlFor="c-person" error={errors.person}>
            <input id="c-person" name="person" type="text" autoComplete="name" className="field" aria-describedby="c-person-error" />
          </Field>
          <Field label="Phone number" htmlFor="c-phone" error={errors.phone}>
            <input id="c-phone" name="phone" type="tel" autoComplete="tel" className="field" aria-describedby="c-phone-error" />
          </Field>
          <Field label="Service of interest" htmlFor="c-service" error={errors.service}>
            <select id="c-service" name="service" defaultValue="" className="field" aria-describedby="c-service-error">
              <option value="">Choose a service</option>
              {services.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </Field>
          <Field label="Brief description of your requirement" htmlFor="c-details">
            <textarea id="c-details" name="details" rows={3} className="field py-3" />
          </Field>

          <button type="submit" className="btn-sun w-full gap-2">
            <MessageCircle size={20} aria-hidden />
            Send on WhatsApp
          </button>

          {link && (
            <p className="text-center text-sm text-bark-muted" aria-live="polite">
              WhatsApp should open with your message ready. If it didn’t,{" "}
              <a href={link} target="_blank" rel="noopener noreferrer" className="font-bold text-olive underline">
                tap here
              </a>
              .
            </p>
          )}
        </form>
      )}

      <div className="grid grid-cols-2 gap-2">
        <a href={`tel:${site.phone}`} className={tile}>
          <span className={tileTitle}><Phone size={18} aria-hidden /> Call us</span>
          <span className={tileDetail}>{site.phoneDisplay}</span>
        </a>
        <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className={tile}>
          <span className={tileTitle}><MessageCircle size={18} aria-hidden /> WhatsApp</span>
          <span className={tileDetail}>{site.whatsappDisplay}</span>
        </a>
        <a href={`mailto:${site.email}`} className={tile}>
          <span className={tileTitle}><Mail size={18} aria-hidden /> Email us</span>
          <span className={tileDetail}>{site.email}</span>
        </a>
        <a
          href="/Maranet_Contact.vcf"
          download="Maranet_Contact.vcf"
          className="col-span-2 flex items-center justify-center gap-2 rounded-xl border border-line bg-white px-3 py-2.5 font-bold text-olive transition-colors hover:border-sun hover:bg-cream"
        >
          <UserPlus size={18} aria-hidden /> Save contact
        </a>
      </div>
    </div>
  );
}