"use client";

import { FormEvent, useState } from "react";
import Field from "./Field";
import { isValidPhone } from "@/lib/validation";
import { submitRequest } from "@/lib/submit";
import { whatsappLink } from "@/lib/site";

const issues = ["No internet", "Slow internet", "Router or Wi-Fi problem", "Billing or payment", "Other"];

type Errors = Partial<Record<"name" | "phone" | "issue" | "details", string>>;

export default function SupportForm() {
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [reference, setReference] = useState("");
    const [waLink, setWaLink] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const v = (k: string) => String(fd.get(k) ?? "").trim();

    const errs: Errors = {};
    if (v("name").length < 2) errs.name = "Please enter your full name.";
    if (!isValidPhone(v("phone"))) errs.phone = "Enter the phone number we can reach you on.";
    if (!v("issue")) errs.issue = "Please choose the type of issue.";
    if (v("details").length < 10) errs.details = "Please describe the problem in a few words.";
    setErrors(errs);
    if (Object.keys(errs).length) return;

    if (v("website")) {
      setStatus("done");
      return;
    }

    setStatus("sending");
    try {
      const res = await submitRequest({
        type: "support",
        name: v("name"),
        phone: v("phone"),
        account: v("account"),
        issue: v("issue"),
        details: v("details"),
      });
      setReference(res.reference);
            setWaLink(
        whatsappLink(
          [
            "Hello Maranet, I need support.",
            `Name: ${v("name")}`,
            `Phone: ${v("phone")}`,
            v("account") ? `Account: ${v("account")}` : "",
            `Issue: ${v("issue")}`,
            `Details: ${v("details")}`,
          ]
            .filter(Boolean)
            .join("\n")
        )
      );
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="card text-center">
        <h2 className="text-3xl font-bold">Thank you, your request is in.</h2>
        <p className="mt-3 text-bark-muted">Our support team will get back to you as soon as possible.</p>
        {reference && <p className="mt-4 font-bold">Your ticket number: {reference}</p>}
                {waLink && (
          <>
            <p className="mt-4 text-bark-muted">For the fastest reply, you can also send your request on WhatsApp.</p>
            <a href={waLink} target="_blank" rel="noopener noreferrer" className="btn-sun mt-3">
              Send this to us on WhatsApp too
            </a>
          </>
        )}
      </div>
    );
    
  }

  return (
    <form onSubmit={onSubmit} noValidate className="card space-y-5">
      <h2 className="text-3xl font-bold">Send a support request</h2>

      <Field label="Full name" htmlFor="name" error={errors.name}>
        <input id="name" name="name" type="text" autoComplete="name" className="field" aria-describedby="name-error" />
      </Field>

      <Field label="Phone number" htmlFor="phone" error={errors.phone}>
        <input id="phone" name="phone" type="tel" autoComplete="tel" className="field" aria-describedby="phone-error" />
      </Field>

      <Field label="Account number(optional)" htmlFor="account" hint="If you have it, we find your account faster.">
        <input id="account" name="account" type="text" className="field" />
      </Field>

      <Field label="What is the issue?" htmlFor="issue" error={errors.issue}>
        <select id="issue" name="issue" defaultValue="" className="field" aria-describedby="issue-error">
          <option value="">Choose an issue</option>
          {issues.map((i) => (
            <option key={i} value={i}>{i}</option>
          ))}
        </select>
      </Field>

      <Field label="Details" htmlFor="details" error={errors.details}>
        <textarea id="details" name="details" rows={4} className="field py-3" aria-describedby="details-error" />
      </Field>

      <div className="absolute -left-[9999px]" aria-hidden>
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {status === "error" && (
        <p role="alert" className="rounded-xl bg-red-50 p-3 font-bold text-red-700">
          Sorry, something went wrong. Please try again or{" "}
          <a className="underline" href={whatsappLink("Hello Maranet, I need support.")}>message us on WhatsApp</a>.
        </p>
      )}

      <button type="submit" disabled={status === "sending"} className="btn-olive w-full disabled:opacity-60">
        {status === "sending" ? "Sending..." : "Send support request"}
      </button>
    </form>
  );
}