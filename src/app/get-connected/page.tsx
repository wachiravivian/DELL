import type { Metadata } from "next";
import { Suspense } from "react";
import InstallationForm from "@/components/forms/InstallationForm";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Get connected – Maranet",
  description: "Request a new Maranet internet installation in Narok. Installation is free.",
};

const next = [
  "We receive your request and your chosen plan.",
  "Our team calls you to confirm your details and location.",
  "We install for free. Your router costs " + site.routerPrice + ".",
];

export default function GetConnectedPage() {
  return (
    <main className="container-site grid gap-12 py-14 lg:grid-cols-[0.9fr_1.1fr] lg:py-20">
      <div>
        <p className="eyebrow">New installation</p>
        <h1 className="mb-4 mt-3 text-4xl font-bold sm:text-5xl">Get connected to Maranet</h1>
        <p className="max-w-lg text-lg text-bark-muted">
          Fill in your details and we will arrange your installation. Installation is free.
        </p>

        <h2 className="mb-4 mt-10 text-2xl font-bold">What happens next</h2>
        <ol className="space-y-4">
          {next.map((t, i) => (
            <li key={t} className="flex gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sun font-display text-lg font-bold">
                {i + 1}
              </span>
              <span className="pt-1.5">{t}</span>
            </li>
          ))}
        </ol>
      </div>

      <Suspense fallback={<div className="card">Loading form...</div>}>
        <InstallationForm />
      </Suspense>
    </main>
  );
}