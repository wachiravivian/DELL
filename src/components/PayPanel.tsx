import CopyButton from "./CopyButton";
import { site } from "@/lib/site";

const steps = [
  "Go to the M-PESA menu.",
  "Select Lipa na M-PESA.",
  "Select Paybill.",
  `Enter the Business number: ${site.paybill}.`,
  `Enter your Maranet account number as the Account number (for example ${site.accountExample}).`,
  "Enter the amount.",
  "Enter your PIN and confirm the transaction.",
];

export default function PayPanel() {
  return (
    <div className="space-y-6">
      <div className="card space-y-6">
        <div>
          <p className="eyebrow">Business number (Paybill)</p>
          <div className="mt-1 flex flex-wrap items-center gap-4">
            <p className="font-display text-5xl font-bold">{site.paybill}</p>
            <CopyButton value={site.paybill} />
          </div>
        </div>
        <div>
          <p className="eyebrow">Account number</p>
          <p className="mt-1 font-display text-2xl font-bold">Your Maranet account number</p>
          <p className="mt-1 text-bark-muted">
            For example: <b>{site.accountExample}</b>. Use your own account number, so the payment goes to your account.
          </p>
        </div>
      </div>

      <div className="card">
        <h2 className="mb-6 text-2xl font-bold">Pay with M-PESA in 7 steps</h2>
        <ol className="space-y-5">
          {steps.map((t, i) => (
            <li key={t} className="flex gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sun font-display text-lg font-bold">
                {i + 1}
              </span>
              <span className="pt-1.5">{t}</span>
            </li>
          ))}
        </ol>

        <div className="mt-8 rounded-2xl border border-olive bg-olive-tint p-5">
          <p className="font-display text-xl font-bold text-olive">Automatic, no need to call</p>
          <p className="mt-1">
            Your payment is credited to your account automatically. If your subscription was suspended, it is restored
            automatically.
          </p>
        </div>

        <p className="mt-4 rounded-xl bg-sand p-4 text-sm font-medium">
          Before you enter your PIN, check that the business number is exactly {site.paybill}.
        </p>
      </div>
    </div>
  );
}