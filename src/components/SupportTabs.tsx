"use client";

import { useEffect, useState } from "react";
import SupportForm from "./forms/SupportForm";
import PayPanel from "./PayPanel";

type Tab = "pay" | "support";

const tabs: { id: Tab; label: string }[] = [
  { id: "support", label: "I need support" },
  { id: "pay", label: "How to Pay" },
];

function fromHash(): Tab {
  const h = window.location.hash;
  return h === "#pay" ? "pay" : "support";
}

export default function SupportTabs() {
  const [tab, setTab] = useState<Tab>("support");

  useEffect(() => {
    const read = () => setTab(fromHash());
    read();
    window.addEventListener("hashchange", read);
    return () => window.removeEventListener("hashchange", read);
  }, []);

  const choose = (t: Tab) => {
    setTab(t);
    window.history.replaceState(null, "", t === "support" ? window.location.pathname : `#${t}`);
  };

  return (
    <div>
      <div role="tablist" className="mb-6 flex gap-1 rounded-full border border-line bg-white p-1">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => choose(t.id)}
            className={`flex-1 rounded-full px-2 py-3 text-sm font-bold transition-colors sm:px-4 sm:text-base ${
              tab === t.id ? "bg-olive text-white" : "text-bark hover:bg-sand"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "support" && <SupportForm />}
      {tab === "pay" && <PayPanel />}
    </div>
  );
}