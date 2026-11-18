"use client";

import { FormEvent, useState } from "react";
import { useSearchParams } from "next/navigation";
import Field from "./Field";
import { areas, findArea } from "@/lib/coverage";
import { plans, planLabel, priceLabel } from "@/lib/plans";
import { isValidEmail, isValidPhone } from "@/lib/validation";
import { submitRequest } from "@/lib/submit";
import { whatsappLink } from "@/lib/site";

type Errors = Partial<Record<"name" | "phone" | "email" | "area" | "location" | "plan", string>>;

const OTHER = "__other";

export default function InstallationForm() {
  const params = useSearchParams();
  const areaParam = params.get("area") ?? "";
  const matched = areaParam ? findArea(areaParam) : undefined;

    const gpsParam = params.get("gps") ?? "";
  const gpsMatch = /^(-?\d{1,3}\.\d+),(-?\d{1,3}\.\d+)$/.exec(gpsParam);
  const initialGps = gpsMatch ? { lat: Number(gpsMatch[1]), lng: Number(gpsMatch[2]) } : null;

  const initialPlan = plans.find((p) => p.slug === params.get("plan"))?.slug ?? "";
  const initialArea = matched ? matched.name : areaParam || gpsParam ? OTHER : "";  const initialLocation = !matched && areaParam ? areaParam : "";

  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [reference, setReference] = useState("");
    const [gps, setGps] = useState<{ lat: number; lng: number } | null>(initialGps);
  const [gpsMsg, setGpsMsg] = useState(initialGps ? "Location captured from the coverage map." : "");

  function shareLocation() {
    if (!navigator.geolocation) {
      setGpsMsg("Your browser can't share your location. You can skip this.");
      return;
    }
    setGpsMsg("Getting your location...");
    navigator.geolocation.getCurrentPosition(
      (p) => {
        setGps({ lat: Number(p.coords.latitude.toFixed(6)), lng: Number(p.coords.longitude.toFixed(6)) });
        setGpsMsg("Location captured. Thank you!");
      },
      () => setGpsMsg("We couldn't get your location. You can skip this."),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const v = (k: string) => String(fd.get(k) ?? "").trim();

    const area = v("area");
    const inside = area !== "" && area !== OTHER;

    const errs: Errors = {};
    if (v("name").length < 2) errs.name = "Please enter your full name.";
    if (!isValidPhone(v("phone"))) errs.phone = "Enter a valid phone number, for example 0703 666 999.";
    if (v("email") && !isValidEmail(v("email"))) errs.email = "That email address doesn't look right.";
    if (!area) errs.area = "Please choose your area.";
    if (area === OTHER && v("location").length < 3) errs.location = "Tell us where you are in Narok.";
    if (!v("plan")) errs.plan = "Please choose a plan.";
    setErrors(errs);
    if (Object.keys(errs).length) return;

    // Spam trap: real people never fill this hidden field
    if (v("website")) {
      setStatus("done");
      return;
    }

    const plan = plans.find((p) => p.slug === v("plan"));
    setStatus("sending");
    try {
      const res = await submitRequest({
        type: "installation",
        name: v("name"),
        phone: v("phone"),
        email: v("email"),
        customer_type: v("customer_type"),
        plan: plan ? `${planLabel(plan)} – ${priceLabel(plan)}` : v("plan"),
        area: inside ? area : "",
        coverage: inside ? "Inside home fibre zone" : "Not on our coverage list yet",
        location: v("location"),
        gps: gps ? `${gps.lat},${gps.lng}` : "",
        best_time: v("best_time"),
        contact_via: v("contact_via"),
        notes: v("notes"),
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
        <h2 className="text-3xl font-bold">Thank you, we have your request!</h2>
        <p className="mt-3 text-bark-muted">Our team will contact you shortly to confirm your installation.</p>
        {reference && <p className="mt-4 font-bold">Your request number: {reference}</p>}
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="card space-y-5">
      <h2 className="text-3xl font-bold">Request installation</h2>

      <Field label="I am a" htmlFor="customer_type">
        <select id="customer_type" name="customer_type" defaultValue="Home" className="field">
          <option value="Home">Home customer</option>
          <option value="Business">Business customer</option>
        </select>
      </Field>

      <Field label="Full name" htmlFor="name" error={errors.name}>
        <input id="name" name="name" type="text" autoComplete="name" className="field" aria-describedby="name-error" />
      </Field>

      <Field label="Phone number" htmlFor="phone" error={errors.phone}>
        <input id="phone" name="phone" type="tel" autoComplete="tel" className="field" aria-describedby="phone-error" />
      </Field>

      <Field label="Email (optional)" htmlFor="email" error={errors.email}>
        <input id="email" name="email" type="email" autoComplete="email" className="field" aria-describedby="email-error" />
      </Field>

      <Field label="Plan" htmlFor="plan" error={errors.plan}>
        <select id="plan" name="plan" defaultValue={initialPlan} className="field" aria-describedby="plan-error">
          <option value="">Choose a plan</option>
          {plans.map((p) => (
            <option key={p.slug} value={p.slug}>
              {planLabel(p)} ({priceLabel(p)})
            </option>
          ))}
        </select>
      </Field>

      <Field label="Your area" htmlFor="area" error={errors.area}>
        <select id="area" name="area" defaultValue={initialArea} className="field" aria-describedby="area-error">
          <option value="">Choose your area</option>
          {areas.map((a) => (
            <option key={a.name} value={a.name}>{a.name}</option>
          ))}
          <option value={OTHER}>My area is not listed</option>
        </select>
      </Field>

      <Field label="Location details" htmlFor="location" error={errors.location} hint="Estate, building or nearest landmark.">
        <input id="location" name="location" type="text" defaultValue={initialLocation} className="field" aria-describedby="location-error" />
      </Field>

      <div>
        <button type="button" onClick={shareLocation} className="btn-outline !min-h-[44px] w-full sm:w-auto">
          Share my current location (optional)
        </button>
        {gpsMsg && <p className="mt-1 text-sm text-bark-soft" aria-live="polite">{gpsMsg}</p>}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Best time to contact you" htmlFor="best_time">
          <select id="best_time" name="best_time" defaultValue="Any time (8am–6pm)" className="field">
            <option>Any time (8am–6pm)</option>
            <option>Morning (8am–12pm)</option>
            <option>Afternoon (12pm–6pm)</option>
          </select>
        </Field>
        <Field label="Contact me via" htmlFor="contact_via">
          <select id="contact_via" name="contact_via" defaultValue="Phone call" className="field">
            <option>Phone call</option>
            <option>WhatsApp</option>
          </select>
        </Field>
      </div>

      <Field label="Anything else we should know? (optional)" htmlFor="notes">
        <textarea id="notes" name="notes" rows={3} className="field py-3" />
      </Field>

      {/* Hidden spam trap */}
      <div className="absolute -left-[9999px]" aria-hidden>
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {status === "error" && (
        <p role="alert" className="rounded-xl bg-red-50 p-3 font-bold text-red-700">
          Sorry, something went wrong. Please try again or{" "}
          <a className="underline" href={whatsappLink("Hello Maranet, I would like to get connected.")}>message us on WhatsApp</a>.
        </p>
      )}

      <button type="submit" disabled={status === "sending"} className="btn-sun w-full disabled:opacity-60">
        {status === "sending" ? "Sending..." : "Request installation"}
      </button>
    </form>
  );
}