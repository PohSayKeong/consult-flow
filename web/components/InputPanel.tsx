"use client";

import { ChangeEvent } from "react";

export type SourceTab = "Transcript" | "Email" | "Notes";

export type InputPanelProps = {
  value: string;
  onChange: (value: string) => void;
  onParse?: () => void;
  isParsing?: boolean;
  activeTab: SourceTab;
  onTabChange: (tab: SourceTab) => void;
  attn?: boolean;
};

const tabs: SourceTab[] = ["Transcript", "Email", "Notes"];

const metadata = [
  { label: "Duration", value: "48 min" },
  { label: "Speakers", value: "4 people" },
  { label: "Date", value: "Apr 24" },
  { label: "Words", value: "1.6k" },
];

export default function InputPanel({
  value,
  onChange,
  onParse,
  isParsing = false,
  activeTab,
  onTabChange,
  attn = false,
}: InputPanelProps) {
  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(event.target.value);
  };

  const canParse = value.trim().length > 0 && !isParsing;

  return (
    <section className="panel flex h-full min-h-0 flex-col overflow-hidden">
      <div className="border-b border-line px-5 pt-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-fg-faint">
              Source
            </div>
            <h2 className="mt-1 text-base font-semibold text-fg">
              Client source material
            </h2>
          </div>
          <div className="mono rounded-full border border-line bg-bg-2 px-2.5 py-1 text-[11px] text-fg-dim">
            raw input
          </div>
        </div>

        <div className="mt-4 flex gap-5">
          {tabs.map((tab) => {
            const active = tab === activeTab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => onTabChange(tab)}
                className={`relative pb-3 text-sm font-medium transition ${
                  active ? "text-fg" : "text-fg-dim hover:text-fg"
                }`}
              >
                {tab}
                {active ? (
                  <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-accent" />
                ) : null}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-line px-5 py-3">
        {metadata.map((item) => (
          <div
            key={item.label}
            className="rounded-full border border-line bg-bg-2 px-3 py-1.5 text-xs text-fg-dim"
          >
            <span className="text-fg-faint">{item.label}</span>
            <span className="ml-2 text-fg">{item.value}</span>
          </div>
        ))}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto bg-[linear-gradient(180deg,rgba(20,23,29,0.65),rgba(11,12,15,0.3))] px-5 py-4">
        <textarea
          value={value}
          onChange={handleChange}
          rows={18}
          spellCheck={false}
          className="min-h-full w-full resize-none border-0 bg-transparent p-0 text-sm leading-7 text-fg outline-none placeholder:text-fg-faint"
          placeholder="Paste a client transcript, email thread, or rough meeting notes here."
        />
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-line bg-bg-1 px-5 py-3">
        <div className="flex items-center gap-3 text-xs text-fg-dim">
          <span className="mono rounded-md border border-line bg-bg-2 px-2 py-1 text-[11px] text-fg-faint">
            CMD + ENTER
          </span>
          <span>Re-parse source into structured consulting work.</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onChange("")}
            className="rounded-md border border-line bg-bg-2 px-3 py-2 text-sm text-fg-dim transition hover:border-line-2 hover:text-fg"
          >
            Clear
          </button>
          <button
            type="button"
            onClick={onParse}
            disabled={!canParse}
            className={`relative rounded-md px-4 py-2 text-sm font-semibold transition ${
              canParse
                ? "bg-accent text-bg hover:brightness-110"
                : "cursor-not-allowed bg-line text-fg-faint"
            } ${attn && canParse ? "animate-pulseSoft" : ""}`}
          >
            {isParsing ? "Parsing..." : "Re-parse"}
          </button>
        </div>
      </div>
    </section>
  );
}
