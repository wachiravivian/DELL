"use client";

import { useState } from "react";
import { submitFeedback } from "@/lib/submit";
import { site } from "@/lib/site";

type Rating = "" | "1" | "2" | "3" | "4" | "5" | "na";

const questions = [
  { key: "installation", tag: "Installation", text: "How satisfied were you with our installation?" },
  { key: "site_visit", tag: "Site visits", text: "How satisfied were you with our technician site visits?" },
  { key: "call_centre", tag: "Support team", text: "How helpful was our support team when you called or messaged?" },
  { key: "issue_resolution", tag: "Fixing problems", text: "When you reported a problem, how satisfied were you with how quickly it was fixed?" },
] as const;

const faces = [
  { v: "1", e: "😞", l: "Very dissatisfied" },
  { v: "2", e: "😕", l: "Dissatisfied" },
  { v: "3", e: "😐", l: "Neutral" },
  { v: "4", e: "🙂", l: "Satisfied" },
  { v: "5", e: "😍", l: "Very satisfied" },
];

export default function FeedbackForm() {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [ratings, setRatings] = useState<Record<string, Rating>>({});
  const [recommend, setRecommend] = useState<number | null>(null);
  const [comments, setComments] = useState("");
  const [spam, setSpam] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [unhappy, setUnhappy] = useState(false);

  const total = questions.length + 3; // who, 4 questions, recommend, comments
  const isRating = step >= 1 && step <= questions.length;
  const isRecommend = step === questions.length + 1;
  const isLast = step === total - 1;
  const q = isRating ? questions[step - 1] : null;

  const canNext = isRating ? !!ratings[q!.key] : isRecommend ? recommend !== null : true;

  async function send() {
    if (spam) {
      setStatus("done");
      return;
    }
    setStatus("sending");
    const low =
      (recommend !== null && recommend <= 6) || Object.values(ratings).some((r) => r === "1" || r === "2");
    try {
      await submitFeedback({
        name: name.trim(),
        contact: contact.trim(),
        installation: ratings.installation ?? "",
        site_visit: ratings.site_visit ?? "",
        call_centre: ratings.call_centre ?? "",
        issue_resolution: ratings.issue_resolution ?? "",
        recommend: String(recommend ?? ""),
        comments: comments.trim(),
      });
      setUnhappy(low);
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="card text-center">
        <p className="text-5xl" aria-hidden>🙏</p>
        <h2 className="mt-3 text-3xl font-bold">Thank you for your feedback!</h2>
        <p className="mt-3 text-bark-muted">Your answers go straight to our service team.</p>
        {unhappy && (
          <p className="mt-4 rounded-xl bg-sand p-4 font-medium">
            We’re sorry we didn’t get everything right. If you’d like us to follow up, please call{" "}
            <a className="font-bold underline" href={`tel:${site.phone}`}>{site.phoneDisplay}</a>.
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="card">
      {/* Progress */}
      <p className="text-sm font-bold text-bark-soft">Step {step + 1} of {total}</p>
      <div className="mb-6 mt-2 h-2 overflow-hidden rounded-full bg-sand" aria-hidden>
        <div className="h-full rounded-full bg-sun transition-all duration-300" style={{ width: `${((step + 1) / total) * 100}%` }} />
      </div>

      {/* Step 0: who */}
      {step === 0 && (
        <div className="space-y-5">
          <div>
            <h2 className="text-2xl font-bold">Tell us who you are</h2>
            <p className="mt-1 text-bark-muted">Optional, so we can follow up if you need help. Feel free to skip.</p>
          </div>
          <div>
            <label className="label" htmlFor="fb-name">Name (optional)</label>
            <input id="fb-name" value={name} onChange={(e) => setName(e.target.value)} className="field" autoComplete="name" />
          </div>
          <div>
            <label className="label" htmlFor="fb-contact">Phone or account number (optional)</label>
            <input id="fb-contact" value={contact} onChange={(e) => setContact(e.target.value)} className="field" />
          </div>
        </div>
      )}

      {/* Steps 1-4: ratings */}
      {isRating && q && (
        <div>
          <p className="eyebrow">{q.tag}</p>
          <h2 className="mb-5 mt-2 text-2xl font-bold">{q.text}</h2>
          <div role="radiogroup" aria-label={q.text} className="grid grid-cols-5 gap-2 sm:gap-3">
            {faces.map((f) => {
              const on = ratings[q.key] === f.v;
              return (
                <button
                  key={f.v}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  aria-label={`${f.v}: ${f.l}`}
                  onClick={() => setRatings({ ...ratings, [q.key]: f.v as Rating })}
                  className={`flex flex-col items-center rounded-2xl border-2 px-1 py-4 transition ${
                    on ? "border-olive bg-olive-tint" : "border-line bg-white hover:border-sun"
                  }`}
                >
                  <span className="text-3xl sm:text-4xl" aria-hidden>{f.e}</span>
                  <span className="mt-1 font-bold">{f.v}</span>
                </button>
              );
            })}
          </div>
          <div className="mt-2 flex justify-between text-sm text-bark-soft">
            <span>1 = Very dissatisfied</span>
            <span>5 = Very satisfied</span>
          </div>
          <button
            type="button"
            onClick={() => setRatings({ ...ratings, [q.key]: "na" })}
            className={`mt-4 rounded-full border px-4 py-2 text-sm font-bold transition ${
              ratings[q.key] === "na" ? "border-olive bg-olive-tint" : "border-line hover:border-sun"
            }`}
          >
            This doesn’t apply to me
          </button>
        </div>
      )}

      {/* Step 5: recommend */}
      {isRecommend && (
        <div>
          <p className="eyebrow">Recommendation</p>
          <h2 className="mb-5 mt-2 text-2xl font-bold">How likely are you to recommend Maranet to friends or family?</h2>
          <div role="radiogroup" aria-label="Likelihood to recommend, 0 to 10" className="grid grid-cols-6 gap-2 sm:grid-cols-11">
            {Array.from({ length: 11 }, (_, n) => (
              <button
                key={n}
                type="button"
                role="radio"
                aria-checked={recommend === n}
                onClick={() => setRecommend(n)}
                className={`rounded-xl border-2 py-3 font-bold transition ${
                  recommend === n ? "border-olive bg-olive text-white" : "border-line bg-white hover:border-sun"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
          <div className="mt-2 flex justify-between text-sm text-bark-soft">
            <span>0 = Not at all likely</span>
            <span>10 = Extremely likely</span>
          </div>
        </div>
      )}

      {/* Step 6: comments */}
      {isLast && (
        <div>
          <p className="eyebrow">Last step</p>
          <h2 className="mb-4 mt-2 text-2xl font-bold">What could we improve about your internet service?</h2>
          <label className="sr-only" htmlFor="fb-comments">Your suggestions</label>
          <textarea id="fb-comments" rows={5} value={comments} onChange={(e) => setComments(e.target.value)} className="field py-3" />
          {/* Hidden spam trap */}
          <div className="absolute -left-[9999px]" aria-hidden>
            <label htmlFor="fb-website">Website</label>
            <input id="fb-website" value={spam} onChange={(e) => setSpam(e.target.value)} tabIndex={-1} autoComplete="off" />
          </div>
          {status === "error" && (
            <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 font-bold text-red-700">
              Sorry, something went wrong. Please try again.
            </p>
          )}
        </div>
      )}

      {/* Buttons */}
      <div className="mt-8 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setStep(step - 1)}
          disabled={step === 0}
          className="btn-outline disabled:invisible"
        >
          ← Back
        </button>
        {isLast ? (
          <button type="button" onClick={send} disabled={status === "sending"} className="btn-sun disabled:opacity-60">
            {status === "sending" ? "Sending..." : "Submit feedback"}
          </button>
        ) : (
          <button type="button" onClick={() => setStep(step + 1)} disabled={!canNext} className="btn-sun disabled:opacity-50">
            Next →
          </button>
        )}
      </div>
    </div>
  );
}