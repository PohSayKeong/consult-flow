"use client";

import { useState } from "react";
import type { ConsultItem, SummaryData } from "@/types/schema";

type RightPanelProps = {
  items: ConsultItem[];
  summary: SummaryData | null;
  selectedItem: ConsultItem | null;
  onBack: () => void;
  onRegenerate?: () => void;
  isRegenerating?: boolean;
};

const ownerGradients: Record<string, string> = {
  LR: "from-[#f472b6] to-[#db2777]",
  MK: "from-[#22d3ee] to-[#0891b2]",
  JS: "from-[#fb923c] to-[#ea580c]",
  AP: "from-[#a78bfa] to-[#7c3aed]",
  CL: "from-[#34d399] to-[#059669]",
  PM: "from-[#f472b6] to-[#db2777]",
};

const kindMeta = {
  task: {
    label: "Task",
    className: "bg-bg-3 text-fg-dim",
  },
  blocker: {
    label: "Blocker",
    className: "bg-[var(--warn-weak)] text-warn",
  },
  risk: {
    label: "Risk",
    className: "bg-[var(--danger-weak)] text-danger",
  },
  waiting: {
    label: "Waiting",
    className: "bg-[var(--info-weak)] text-info",
  },
} satisfies Record<
  ConsultItem["kind"],
  {
    label: string;
    className: string;
  }
>;

const statusLabel: Record<ConsultItem["status"], string> = {
  todo: "Todo",
  doing: "In progress",
  waiting: "Waiting on client",
  done: "Done",
};

function summaryParagraphs(summary: SummaryData | null) {
  if (!summary?.execSummary) {
    return [
      "Run extraction to generate an executive summary, client digest, and provenance trail for this session.",
    ];
  }

  return summary.execSummary
    .replaceAll("</p>", "")
    .split("<p>")
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

function digestValue(value: string | undefined) {
  return value && value.trim().length > 0 ? value : "Not generated yet.";
}

function SummaryMode({
  items,
  summary,
}: {
  items: ConsultItem[];
  summary: SummaryData | null;
}) {
  if (items.length === 0) {
    return (
      <div className="grid min-h-full place-items-center p-5">
        <div className="max-w-[240px] rounded-xl border border-dashed border-line bg-bg-1 p-5 text-center">
          <div className="text-[11px] uppercase tracking-[0.12em] text-fg-faint">
            Empty summary
          </div>
          <div className="mt-2 text-base font-semibold text-fg">
            Nothing to summarize yet
          </div>
          <p className="mt-3 text-sm leading-6 text-fg-dim">
            Run extraction from the source panel to generate an executive summary, digest,
            and provenance notes for this session.
          </p>
        </div>
      </div>
    );
  }

  const total = items.length;
  const waiting = items.filter((item) => item.waiting).length;
  const blockers = items.filter((item) => item.kind === "blocker").length;
  const risks = items.filter((item) => item.kind === "risk").length;
  const done = items.filter((item) => item.status === "done").length;
  const doing = items.filter((item) => item.status === "doing").length;
  const waitingStatus = items.filter((item) => item.status === "waiting").length;
  const todo = items.filter((item) => item.status === "todo").length;
  const denom = Math.max(total, 1);
  const movingPercent = Math.round(((done + doing) / denom) * 100);

  const paragraphs = summaryParagraphs(summary);
  const digest = summary?.clientDigest;

  return (
    <div className="space-y-5 p-4">
      <section className="rounded-[8px] border border-line bg-bg-2 p-4">
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.12em] text-fg-faint">
          <span className="h-1.5 w-1.5 rounded-full bg-ok shadow-[0_0_8px_var(--ok)]" />
          Snapshot · Current session
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          {[
            { label: "Action items", value: total, tone: "text-accent" },
            { label: "Waiting", value: waiting, tone: "text-info" },
            { label: "Blockers", value: blockers, tone: "text-warn" },
            { label: "Risks", value: risks, tone: "text-danger" },
          ].map((stat) => (
            <div key={stat.label} className="rounded-[8px] border border-line bg-bg-1 p-3">
              <div className="text-[11px] uppercase tracking-[0.12em] text-fg-faint">
                {stat.label}
              </div>
              <div className={`mt-2 text-2xl font-semibold ${stat.tone}`}>
                {stat.value.toString().padStart(2, "0")}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center gap-3 text-[11px] text-fg-mute">
          <div className="flex h-1.5 flex-1 overflow-hidden rounded-full bg-bg-3">
            <div className="bg-ok" style={{ width: `${(done / denom) * 100}%` }} />
            <div
              className="bg-accent"
              style={{ width: `${(doing / denom) * 100}%` }}
            />
            <div
              className="bg-info"
              style={{ width: `${(waitingStatus / denom) * 100}%` }}
            />
            <div
              className="bg-line-2"
              style={{ width: `${(todo / denom) * 100}%` }}
            />
          </div>
          <span>{movingPercent}% moving</span>
        </div>
      </section>

      <section className="rounded-[8px] border border-line bg-bg-2 p-4">
        <div className="text-[11px] uppercase tracking-[0.12em] text-fg-faint">
          Executive summary
        </div>
        <div className="mt-3 space-y-3 text-sm leading-6 text-fg-dim">
          {paragraphs.map((paragraph) => (
            <p
              key={paragraph}
              dangerouslySetInnerHTML={{
                __html: paragraph
                  .replaceAll("class='em'", "class='text-fg font-medium'")
                  .replaceAll('class="em"', 'class="text-fg font-medium"')
                  .replaceAll("class='em-warn'", "class='text-warn font-medium'")
                  .replaceAll('class="em-warn"', 'class="text-warn font-medium"')
                  .replaceAll("class='em-risk'", "class='text-danger font-medium'")
                  .replaceAll('class="em-risk"', 'class="text-danger font-medium"'),
              }}
            />
          ))}
        </div>
      </section>

      <section className="rounded-[8px] border border-line bg-bg-2 p-4">
        <div className="text-[11px] uppercase tracking-[0.12em] text-fg-faint">
          Client digest
        </div>
        <div className="mt-3 space-y-3 text-sm text-fg-dim">
          {[
            { label: "Next from client", value: digestValue(digest?.nextFromClient) },
            { label: "Next from us", value: digestValue(digest?.nextFromUs) },
            { label: "Flags", value: digestValue(digest?.flags) },
          ].map((row) => (
            <div key={row.label} className="flex gap-3 rounded-[8px] border border-line bg-bg-1 p-3">
              <div className="text-accent">→</div>
              <div>
                <div className="text-[11px] uppercase tracking-[0.12em] text-fg-faint">
                  {row.label}
                </div>
                <div className="mt-1 leading-6 text-fg-dim">{row.value}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="rounded-[8px] border border-dashed border-line bg-bg-1 px-3 py-2 text-[11px] text-fg-faint">
        {summary?.provenance ?? "Provenance will appear here after summary generation."}
      </div>
    </div>
  );
}

function DetailMode({
  item,
  onBack,
}: {
  item: ConsultItem;
  onBack: () => void;
}) {
  const meta = kindMeta[item.kind];
  const ownerGradient = ownerGradients[item.owner] ?? ownerGradients.MK;

  return (
    <div className="p-4 text-[12.5px] text-fg">
      <div className="mb-2 flex flex-wrap gap-1.5">
        <span
          className={`inline-flex items-center rounded-[3px] px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.05em] ${meta.className}`}
        >
          {meta.label}
        </span>
        {item.waiting ? (
          <span className="inline-flex items-center rounded-[3px] bg-[var(--info-weak)] px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.05em] text-info">
            Waiting on client
          </span>
        ) : null}
        <span className="inline-flex items-center rounded-[3px] border border-line px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.05em] text-fg-mute">
          {statusLabel[item.status]}
        </span>
      </div>

      <div className="mb-3 text-[15px] font-semibold leading-[1.3] tracking-[-0.01em] text-fg">
        {item.title}
      </div>

      <div className="mb-4 grid grid-cols-[90px_1fr] gap-y-2 text-[12px]">
        <div className="text-fg-mute">Owner</div>
        <div className="flex items-center gap-2 text-fg">
          <span
            className={`grid h-[18px] w-[18px] place-items-center rounded-full bg-gradient-to-br text-[10px] font-semibold text-white ${ownerGradient}`}
          >
            {item.owner}
          </span>
          {item.ownerName}
        </div>
        <div className="text-fg-mute">Due</div>
        <div>{item.due}</div>
        <div className="text-fg-mute">Status</div>
        <div>{statusLabel[item.status]}</div>
        <div className="text-fg-mute">Type</div>
        <div>
          {meta.label}
          {item.waiting ? " · waiting on client" : ""}
        </div>
        <div className="text-fg-mute">Tags</div>
        <div className="flex flex-wrap gap-1.5">
          {item.tags.length > 0 ? (
            item.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-[3px] border border-line bg-bg-3 px-1.5 py-0.5 text-[10px] text-fg-dim"
              >
                {tag}
              </span>
            ))
          ) : (
            <span className="text-fg-faint">No tags</span>
          )}
        </div>
        <div className="text-fg-mute">Engagement</div>
        <div>Acme · Q3 Market Entry</div>
      </div>

      {item.quote ? (
        <>
          <div className="text-[11px] uppercase tracking-[0.12em] text-fg-faint">
            Source
          </div>
          <blockquote className="my-3 border-l-2 border-accent pl-3 text-[12px] italic text-fg-dim">
            "{item.quote}"
          </blockquote>
          <div className="text-[11px] text-fg-faint">
            Steering #14 transcript · {item.owner === "PM" ? "Priya M." : item.ownerName} ·
            {" "}Oct 18
          </div>
        </>
      ) : (
        <div className="mt-2 text-[11.5px] text-fg-faint">
          No source quote available for this item.
        </div>
      )}

      <div className="mt-4 flex gap-2">
        <button
          type="button"
          className="flex-1 rounded-md bg-accent px-3 py-2 text-sm font-semibold text-bg transition hover:brightness-110"
        >
          Add to digest
        </button>
        <button
          type="button"
          onClick={onBack}
          className="rounded-md border border-line bg-bg-1 px-3 py-2 text-sm text-fg-dim transition hover:border-line-2 hover:text-fg"
        >
          Back
        </button>
      </div>
    </div>
  );
}

export default function RightPanel({
  items,
  summary,
  selectedItem,
  onBack,
  onRegenerate,
  isRegenerating = false,
}: RightPanelProps) {
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);

  const handleCopy = async () => {
    if (!summary) {
      return;
    }

    const copyText = [
      summary.execSummary.replace(/<[^>]+>/g, ""),
      "",
      `Next from client: ${summary.clientDigest.nextFromClient}`,
      `Next from us: ${summary.clientDigest.nextFromUs}`,
      `Flags: ${summary.clientDigest.flags}`,
      "",
      `Provenance: ${summary.provenance}`,
    ].join("\n");

    await navigator.clipboard.writeText(copyText);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  const handleShareDigest = async () => {
    if (!summary) {
      return;
    }

    const digestText = [
      `Next from client: ${summary.clientDigest.nextFromClient}`,
      `Next from us: ${summary.clientDigest.nextFromUs}`,
      `Flags: ${summary.clientDigest.flags}`,
    ].join("\n");

    await navigator.clipboard.writeText(digestText);
    setShared(true);
    window.setTimeout(() => setShared(false), 1500);
  };

  return (
    <aside className="panel flex h-full min-h-0 flex-col overflow-hidden">
      <div className="flex items-center border-b border-line px-5 py-4">
        <span className="text-base font-semibold text-fg">
          {selectedItem ? selectedItem.id : "Executive summary"}
        </span>
        <span className="ml-auto flex items-center gap-2 text-fg-mute">
          {!selectedItem ? (
            <>
              <button
                type="button"
                onClick={handleCopy}
                disabled={!summary}
                className="grid h-7 w-7 place-items-center rounded-md border border-line bg-bg-1 transition hover:border-line-2 hover:text-fg disabled:cursor-not-allowed disabled:opacity-50"
                title={copied ? "Copied" : "Copy"}
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <rect x="9" y="9" width="12" height="12" rx="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
              </button>
              <button
                type="button"
                onClick={handleShareDigest}
                disabled={!summary}
                className="rounded-md border border-line bg-bg-1 px-2 py-1 text-[11px] transition hover:border-line-2 hover:text-fg disabled:cursor-not-allowed disabled:opacity-50"
                title={shared ? "Digest copied" : "Share digest"}
              >
                {shared ? "Shared digest" : "Share digest"}
              </button>
              <button
                type="button"
                onClick={onRegenerate}
                disabled={!onRegenerate || isRegenerating || items.length === 0}
                className="grid h-7 w-7 place-items-center rounded-md border border-line bg-bg-1 transition hover:border-line-2 hover:text-fg disabled:cursor-not-allowed disabled:opacity-50"
                title={isRegenerating ? "Regenerating" : "Regenerate"}
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <path d="M21 12a9 9 0 1 1-3-6.7L21 8M21 3v5h-5" />
                </svg>
              </button>
            </>
          ) : null}
        </span>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {selectedItem ? (
          <DetailMode item={selectedItem} onBack={onBack} />
        ) : (
          <SummaryMode items={items} summary={summary} />
        )}
      </div>
    </aside>
  );
}
