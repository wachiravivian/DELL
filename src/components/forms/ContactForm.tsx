"use client";

import { FormEvent, useState } from "react";
import Field from "./Field";
import { services } from "@/lib/services";
import { isValidEmail, isValidPhone } from "@/lib/validation";
import { submitRequest } from "@/lib/submit";
import { whatsappLink } from "@/lib/site";

const topics = ["New connection / packages", ...services.map((s) => s.title), "Other"];

type Errors = Partial<Record<"name" | "phone" | "email" | "topic" | "message", string>>;

export default function ContactForm() {
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [reference, setReference] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const v = (k: string) => String(fd.get(k) ?? "").trim();

    const errs: Errors = {};
    if (v("name").length < 2) errs.name = "Please enter your full name.";
    if (!isValidPhone(v("phone"))) errs.phone = "Enter a valid phone number, for example 0703 666 999.";
    if (v("email") && !isValidEmail(v("email"))) errs.email = "That email address doesn't look right.";
    if (!v("topic")) errs.topic = "Please choose what your message is about.";
    if (v("message").length < 10) errs.message = "Please write a few words about what you need.";
    setErrors(errs);
    if (Object.keys(errs).length) return;

    if (v("website")) {
      setStatus("done");
      return;
    }

    setStatus("sending");
    try {
      const res = await submitRequest({
        type: "enquiry",
        name: v("name"),
        phone: v("phone"),
        email: v("email"),
        topic: v("topic"),
        message: v("message"),
      });
      setReference(res.reference);
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="card text-center">
        <h2 className="text-3xl font-bold">Thank you, we got your message.</h2>
        <p className="mt-3 text-bark-muted">Our team will get back to you shortly.</p>
        {reference && <p className="mt-4 font-bold">Your reference number: {reference}</p>}
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="card space-y-5">
      <h2 className="text-3xl font-bold">Send us a message</h2>

      <Field label="Full name" htmlFor="name" error={errors.name}>
        <input id="name" name="name" type="text" autoComplete="name" className="field" aria-describedby="name-error" />
      </Field>

      <Field label="Phone number" htmlFor="phone" error={errors.phone}>
        <input id="phone" name="phone" type="tel" autoComplete="tel" className="field" aria-describedby="phone-error" />
      </Field>

      <Field label="Email (optional)" htmlFor="email" error={errors.email}>
        <input id="email" name="email" type="email" autoComplete="email" className="field" aria-describedby="email-error" />
      </Field>

      <Field label="What is it about?" htmlFor="topic" error={errors.topic}>
        <select id="topic" name="topic" defaultValue="" className="field" aria-describedby="topic-error">
          <option value="">Choose a topic</option>
          {topics.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </Field>

      <Field label="Message" htmlFor="message" error={errors.message}>
        <textarea id="message" name="message" rows={4} className="field py-3" aria-describedby="message-error" />
      </Field>

      <div className="absolute -left-[9999px]" aria-hidden>
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {status === "error" && (
        <p role="alert" className="rounded-xl bg-red-50 p-3 font-bold text-red-700">
          Sorry, something went wrong. Please try again or{" "}
          <a className="underline" href={whatsappLink("Hello Maranet, I have an enquiry.")}>message us on WhatsApp</a>.
        </p>
      )}

      <button type="submit" disabled={status === "sending"} className="btn-sun w-full disabled:opacity-60">
        {status === "sending" ? "Sending..." : "Send message"}
      </button>
    </form>
  );
}