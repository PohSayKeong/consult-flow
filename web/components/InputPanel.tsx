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
  const showHighlights = activeTab === "Transcript" && highlightSegments.length > 0;
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
        {showHighlights ? (
          <div className="space-y-3">
            <div className="text-[11px] uppercase tracking-[0.12em] text-fg-faint">
              Transcript with extracted source highlights
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
        ) : (
          <textarea
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            rows={18}
            spellCheck={false}
            className="min-h-full w-full resize-none border-0 bg-transparent p-0 text-sm leading-7 text-fg outline-none placeholder:text-fg-faint"
            placeholder="Paste a client transcript, email thread, or rough meeting notes here."
          />
        )}
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
