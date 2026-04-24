"use client";

import { ChangeEvent, KeyboardEvent, useMemo } from "react";

export type SourceTab = "Transcript" | "Email" | "Notes";
export type InputHighlight = {
  id: string;
  kind: "task" | "blocker" | "risk" | "waiting";
  quote: string;
};

export type InputPanelProps = {
  value: string;
  onChange: (value: string) => void;
  onParse?: () => void;
  isParsing?: boolean;
  activeTab: SourceTab;
  onTabChange: (tab: SourceTab) => void;
  onToggle?: () => void;
  attn?: boolean;
  highlights?: InputHighlight[];
  onHighlightSelect?: (id: string) => void;
};

const tabs: SourceTab[] = ["Transcript", "Email", "Notes"];

const metadata = [
  { label: "Duration", value: "48 min" },
  { label: "Speakers", value: "4 people" },
  { label: "Date", value: "Apr 24" },
  { label: "Words", value: "1.6k" },
];

function buildHighlightSegments(value: string, highlights: InputHighlight[]) {
  const ranges = highlights
    .map((highlight) => {
      const normalizedQuote = highlight.quote.trim();

      if (!normalizedQuote) {
        return null;
      }

      const start = value.toLowerCase().indexOf(normalizedQuote.toLowerCase());

      if (start === -1) {
        return null;
      }

      return {
        ...highlight,
        start,
        end: start + normalizedQuote.length,
      };
    })
    .filter((range): range is InputHighlight & { start: number; end: number } => Boolean(range))
    .sort((a, b) => a.start - b.start);

  const nonOverlapping = ranges.filter((range, index) => {
    const previous = ranges[index - 1];
    return !previous || range.start >= previous.end;
  });

  const segments: Array<
    | { type: "text"; text: string }
    | { type: "highlight"; text: string; id: string; kind: InputHighlight["kind"] }
  > = [];

  let cursor = 0;

  nonOverlapping.forEach((range) => {
    if (range.start > cursor) {
      segments.push({ type: "text", text: value.slice(cursor, range.start) });
    }

    segments.push({
      type: "highlight",
      text: value.slice(range.start, range.end),
      id: range.id,
      kind: range.kind,
    });
    cursor = range.end;
  });

  if (cursor < value.length) {
    segments.push({ type: "text", text: value.slice(cursor) });
  }

  return segments;
}

export default function InputPanel({
  value,
  onChange,
  onParse,
  isParsing = false,
  activeTab,
  onTabChange,
  onToggle,
  attn = false,
  highlights = [],
  onHighlightSelect,
}: InputPanelProps) {
  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(event.target.value);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if ((event.metaKey || event.ctrlKey) && event.key === "Enter" && canParse) {
      event.preventDefault();
      onParse?.();
    }
  };

  const canParse = value.trim().length > 0 && !isParsing;
  const highlightSegments = useMemo(
    () => buildHighlightSegments(value, highlights),
    [highlights, value],
  );
  const visibleMetadata = activeTab === "Transcript" ? metadata : [];
  const hasHighlightMatches = useMemo(
    () => highlightSegments.some((segment) => segment.type === "highlight"),
    [highlightSegments],
  );
  const showHighlights =
    activeTab === "Transcript" && highlights.length > 0 && hasHighlightMatches;
  const highlightClasses: Record<InputHighlight["kind"], string> = {
    task: "bg-accent-weak text-fg",
    blocker: "bg-[var(--warn-weak)] text-warn",
    risk: "bg-[var(--danger-weak)] text-danger",
    waiting: "bg-[var(--info-weak)] text-info",
  };

  return (
    <section className="panel flex h-full min-h-0 flex-col overflow-hidden">
      <div className="border-b border-line px-5 pt-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="mt-1 text-base font-semibold text-fg">
              Source
            </h2>
          </div>
          {onToggle ? (
            <button
              type="button"
              onClick={onToggle}
              title="Hide source"
              className="rounded-md border border-line bg-bg-2 p-2 text-fg-dim transition hover:border-line-2 hover:text-fg"
            >
              <svg
                viewBox="0 0 20 20"
                width="16"
                height="16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M12.25 5.25L7.75 10l4.5 4.75"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          ) : null}
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

      {visibleMetadata.length > 0 ? (
        <div className="flex flex-wrap gap-2 border-b border-line px-5 py-3">
          {visibleMetadata.map((item) => (
            <div
              key={item.label}
              className="rounded-full border border-line bg-bg-2 px-3 py-1.5 text-xs text-fg-dim"
            >
              <span className="text-fg-faint">{item.label}</span>
              <span className="ml-2 text-fg">{item.value}</span>
            </div>
          ))}
        </div>
      ) : null}

      <div className="min-h-0 flex-1 overflow-y-auto bg-[linear-gradient(180deg,rgba(20,23,29,0.65),rgba(11,12,15,0.3))] px-5 py-4">
        <textarea
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          rows={18}
          spellCheck={false}
          className="min-h-full w-full resize-none border-0 bg-transparent p-0 text-sm leading-7 text-fg outline-none placeholder:text-fg-faint"
          placeholder="Paste a client transcript, email thread, or rough meeting notes here."
        />
        {showHighlights ? (
          <div className="mt-4 space-y-3 border-t border-line pt-4">
            <div className="text-[11px] uppercase tracking-[0.12em] text-fg-faint">
              Extracted source highlights
            </div>
            <div className="whitespace-pre-wrap text-sm leading-7 text-fg">
              {highlightSegments.map((segment, index) =>
                segment.type === "highlight" ? (
                  <button
                    key={`${segment.id}-${index}`}
                    type="button"
                    onClick={() => onHighlightSelect?.(segment.id)}
                    className={`rounded px-1 py-0.5 text-left transition hover:brightness-110 ${highlightClasses[segment.kind]}`}
                  >
                    {segment.text}
                  </button>
                ) : (
                  <span key={`text-${index}`}>{segment.text}</span>
                ),
              )}
            </div>
          </div>
        ) : null}
      </div>

      <div className="flex items-center justify-end gap-3 border-t border-line bg-bg-1 px-5 py-3">
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
