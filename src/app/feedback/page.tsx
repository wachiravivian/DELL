import type { Metadata } from "next";
import FeedbackForm from "@/components/forms/FeedbackForm";

export const metadata: Metadata = {
  title: "Rate our service – Maranet",
  description: "A one-minute survey about your Maranet internet experience.",
  robots: { index: false, follow: true },
};

export default function FeedbackPage() {
  return (
    <main>
      <section className="bg-sand py-8 lg:py-10">
        <div className="container-site">
          <p className="eyebrow">Customer survey</p>
          <h1 className="mb-2 mt-2 text-4xl font-bold sm:text-5xl">How are we doing?</h1>
          <p className="max-w-2xl text-lg text-bark-muted">A few quick taps, under a minute. Your voice shapes our service.</p>
        </div>
      </section>

      <section className="container-site pb-16 pt-10 lg:pb-20">
        <div className="mx-auto max-w-2xl">
          <FeedbackForm />
          <p className="mt-4 text-center text-sm text-bark-soft">
            Your answers go straight to our service team. Name and phone are optional.
          </p>
        </div>
      </section>
    </main>
  );
}