"use client";

import { useState } from "react";

type SummaryPanelProps = {
  email: string;
};

export function SummaryPanel({ email }: SummaryPanelProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(email);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="grid gap-4 rounded-[28px] border border-slate-200 bg-white/95 p-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="grid gap-1">
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-teal">
            Client Draft
          </span>
          <h2 className="text-2xl font-semibold text-ink">Review the update email</h2>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-teal hover:text-teal"
        >
          {copied ? "Copied" : "Copy to clipboard"}
        </button>
      </div>

      <textarea
        readOnly
        value={email}
        rows={16}
        className="min-h-80 w-full resize-y rounded-2xl border border-slate-300 bg-slate-50 px-4 py-4 text-sm leading-7 text-slate-800 outline-none"
      />
    </section>
  );
}

export default SummaryPanel;
