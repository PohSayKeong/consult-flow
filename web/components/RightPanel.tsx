"use client";

import { useState } from "react";
import type { ConsultItem, SummaryData } from "@/types/schema";
import type { AutoActionResult } from "@/lib/mocks";

type RightPanelProps = {
  items: ConsultItem[];
  summary: SummaryData | null;
  digestIds: string[];
  selectedItem: ConsultItem | null;
  onBack: () => void;
  onStatusChange: (id: string, status: ConsultItem["status"]) => void;
  onSelectItem?: (id: string) => void;
  onToggleDigest?: (id: string) => void;
  onGenerateSummary?: () => void;
  onSendEmail?: () => void;
  isGeneratingSummary?: boolean;
  isSendingEmail?: boolean;
  isSummarizingDelay?: boolean;
  emailSent?: boolean;
  showEmailPreview?: boolean;
  emailPreviewContent?: string;
  actionResults?: Record<string, AutoActionResult>;
  runningAction?: string | null;
  onRunAction?: (itemId: string, action: string) => void;
  onActionsComplete?: (itemId: string) => void;
  onConfirmSendEmail?: () => void;
  onCancelSendEmail?: () => void;
};

type ActionToConfirm = { itemId: string; action: string; label: string } | null;

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
    label: "Client dependency",
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
  waiting: "Awaiting client",
  done: "Done",
};

function summaryParagraphs(summary: SummaryData) {
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
  digestIds,
  onGenerateSummary,
  onSendEmail,
  isGeneratingSummary,
  isSendingEmail,
  isSummarizingDelay,
  emailSent,
  showEmailPreview,
  emailPreviewContent,
  onSelectItem,
onConfirmSendEmail,
  onCancelSendEmail,
}: {
  items: ConsultItem[];
  summary: SummaryData | null;
  digestIds: string[];
  onGenerateSummary: (() => void) | undefined;
  onSendEmail: (() => void) | undefined;
  isGeneratingSummary: boolean;
  isSendingEmail: boolean;
  isSummarizingDelay?: boolean;
  emailSent: boolean;
  showEmailPreview?: boolean;
  emailPreviewContent?: string;
  onSelectItem: ((id: string) => void) | undefined;
  onConfirmSendEmail?: () => void;
  onCancelSendEmail?: () => void;
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

  if (!summary && digestIds.length === 0) {
    return (
      <div className="grid min-h-full place-items-center p-5">
        <div className="max-w-[260px] rounded-xl border border-dashed border-line bg-bg-1 p-5 text-center">
          <div className="text-[11px] uppercase tracking-[0.12em] text-fg-faint">
            Digest
          </div>
          <div className="mt-2 text-base font-semibold text-fg">
            Add tasks to the digest
          </div>
          <p className="mt-3 text-sm leading-6 text-fg-dim">
            Open a card and click <span className="text-fg">Add to digest</span> to
            curate what gets summarized.
          </p>
        </div>
      </div>
    );
  }

  const digestItems = digestIds
    .map((id) => items.find((item) => item.id === id))
    .filter((item): item is ConsultItem => Boolean(item));

  const paragraphs = summary ? summaryParagraphs(summary) : [];
  const digest = summary?.clientDigest;

  return (
    <div className="space-y-5 p-4">
      {digestItems.length > 0 ? (
        <section className="rounded-[8px] border border-line bg-bg-2 p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-[11px] uppercase tracking-[0.12em] text-fg-faint">
                Digest
              </div>
              <div className="mt-1 text-sm text-fg-dim">Curated items to summarize</div>
            </div>
            <span className="rounded-full border border-line bg-bg-1 px-2 py-1 text-[11px] text-fg-dim">
              {digestItems.length} {digestItems.length === 1 ? "item" : "items"}
            </span>
          </div>

          <div className="mt-3 space-y-2">
            {digestItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectItem?.(item.id)}
                className="flex w-full items-start gap-2 rounded-[8px] border border-line bg-bg-1 px-3 py-2 text-left transition hover:border-line-2 hover:bg-bg-2"
              >
                <span className="whitespace-nowrap mono mt-0.5 text-[11px] text-fg-faint">{item.id}</span>
                <span className="text-sm text-fg-dim line-clamp-2">{item.title}</span>
              </button>
            ))}
          </div>
        </section>
      ) : null}

      {!summary ? (
        <div className="rounded-[8px] border border-dashed border-line bg-bg-1 p-4">
          <div className="text-[11px] uppercase tracking-[0.12em] text-fg-faint">
            Executive summary
          </div>
          <div className="mt-2 text-sm text-fg-dim">
            Empty until you generate it.
          </div>
          {onGenerateSummary && digestIds.length > 0 ? (
            <button
              type="button"
              onClick={onGenerateSummary}
              disabled={isGeneratingSummary || isSummarizingDelay}
              className="mt-4 w-full rounded-md bg-accent px-3 py-2 text-sm font-semibold text-bg transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isGeneratingSummary || isSummarizingDelay ? "Generating summary..." : "Generate summary"}
            </button>
          ) : null}
        </div>
      ) : null}

{summary ? (
        <>
          <section className="rounded-[8px] border border-line bg-bg-2 p-4">
            <div className="flex items-center justify-between">
              <div className="text-[11px] uppercase tracking-[0.12em] text-fg-faint">
                Executive summary
              </div>
              {onGenerateSummary ? (
                <button
                  type="button"
                  onClick={onGenerateSummary}
                  disabled={isGeneratingSummary || digestIds.length === 0}
                  className="rounded-md border border-accent bg-bg px-3 py-1.5 text-sm text-accent transition hover:border-accent-2 hover:text-accent-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isGeneratingSummary ? "Regenerating…" : "Regenerate"}
                </button>
              ) : null}
            </div>
            <div className="mt-3 space-y-3 text-sm leading-6 text-fg-dim">
              {paragraphs.map((paragraph) => (
                <p
                  key={paragraph}
                  dangerouslySetInnerHTML={{
                    __html: paragraph
                      .replaceAll("class='em'", "class='text-fg font-medium'")
                      .replaceAll('class="em"', 'class="text-fg font-medium"')
                      .replaceAll(
                        "class='em-warn'",
                        "class='text-warn font-medium'",
                      )
                      .replaceAll(
                        'class="em-warn"',
                        'class="text-warn font-medium"',
                      )
                      .replaceAll(
                        "class='em-risk'",
                        "class='text-danger font-medium'",
                      )
                      .replaceAll(
                        'class="em-risk"',
                        'class="text-danger font-medium"',
                      ),
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
                {
                  label: "Next from client",
                  value: digestValue(digest?.nextFromClient),
                },
                { label: "Next from us", value: digestValue(digest?.nextFromUs) },
                { label: "Flags", value: digestValue(digest?.flags) },
              ].map((row) => (
                <div
                  key={row.label}
                  className="flex gap-3 rounded-[8px] border border-line bg-bg-1 p-3"
                >
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
<div className="mt-4 flex items-center gap-3">
              <button
                type="button"
                onClick={onSendEmail}
                disabled={isSendingEmail || !summary || emailSent}
                className="rounded-md border border-accent bg-transparent px-3 py-2 text-sm text-accent transition hover:bg-accent hover:text-bg disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSendingEmail ? "Sending…" : emailSent ? "Sent to client" : "Preview & send"}
              </button>
              {emailSent && (
                <span className="text-[11px] text-fg-faint">Formal tone</span>
              )}
            </div>
          </section>

          <div className="rounded-[8px] border border-dashed border-line bg-bg-1 px-3 py-2 text-[11px] text-fg-faint">
            {summary.provenance}
          </div>
        </>
      ) : null}

      {showEmailPreview && emailPreviewContent ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-[480px] max-h-[80vh] overflow-y-auto rounded-lg border border-line bg-bg-2 p-4 shadow-xl">
            <div className="text-base font-semibold text-fg">Preview email</div>
            <div className="mt-3 space-y-2 text-sm">
              <div className="text-fg-mute">To: Sarah Chen &lt;s.chen@acmecorp.com&gt;</div>
              <div className="text-fg-mute">Cc: Consulting Team &lt;team@firm.com&gt;</div>
              <div className="text-fg font-medium">Subject: Acme Corp — Weekly Status Update</div>
            </div>
            <div className="mt-4 rounded-md border border-line bg-bg-1 p-3">
              <pre className="whitespace-pre-wrap text-[12px] leading-relaxed text-fg font-sans">
                {emailPreviewContent}
              </pre>
            </div>
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={onConfirmSendEmail}
                disabled={isSendingEmail}
                className="flex-1 rounded-md bg-accent px-3 py-2 text-sm font-semibold text-bg transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSendingEmail ? "Sending..." : "Send now"}
              </button>
              <button
                type="button"
                onClick={onCancelSendEmail}
                disabled={isSendingEmail}
                className="flex-1 rounded-md border border-line bg-bg-1 px-3 py-2 text-sm text-fg-dim transition hover:border-line-2 hover:text-fg disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function DetailMode({
  item,
  onBack,
  inDigest,
  onToggleDigest,
  onStatusChange,
  actionResults,
  runningAction,
  onRunAction,
  onActionsComplete,
}: {
  item: ConsultItem;
  onBack: () => void;
  inDigest: boolean;
  onToggleDigest: ((id: string) => void) | undefined;
  onStatusChange: (id: string, status: ConsultItem["status"]) => void;
  actionResults?: Record<string, AutoActionResult>;
  runningAction?: string | null;
  onRunAction?: (itemId: string, action: string) => void;
  onActionsComplete?: (itemId: string) => void;
}) {
  const [actionToConfirm, setActionToConfirm] = useState<ActionToConfirm>(null);
  const [showNextDelay, setShowNextDelay] = useState(false);
  const [generatingKey, setGeneratingKey] = useState<string | null>(null);
  const [actionsComplete, setActionsComplete] = useState(false);
  const meta = kindMeta[item.kind];
  const ownerGradient = ownerGradients[item.owner] ?? ownerGradients.MK;

  const actionSequence: { action: string; label: string }[] =
    item.kind === "task"
      ? [
          { action: "draft_memo", label: "Draft action memo" },
          { action: "draft_followup", label: "Draft follow-up" },
          { action: "draft_update", label: "Draft status update" },
        ]
      : item.kind === "waiting"
        ? [
            { action: "draft_nudge", label: "Draft nudge email" },
            { action: "draft_escalation", label: "Draft escalation" },
            { action: "update_status", label: "Update status" },
          ]
        : item.kind === "blocker"
          ? [
              { action: "escalation_note", label: "Write escalation note" },
              { action: "risk_memo", label: "Write risk memo" },
              { action: "log_update", label: "Log update" },
            ]
          : [
              { action: "risk_memo", label: "Write risk memo" },
              { action: "mitigation_plan", label: "Create mitigation plan" },
              { action: "escalation_note", label: "Write escalation note" },
            ];

  const completedCount = Math.min(
    Object.keys(actionResults || {}).filter((key) => key.startsWith(item.id + ":")).length,
    actionSequence.length,
  );
  const nextAction = actionSequence[completedCount];
  const nextActionKey = nextAction ? `${item.id}:${nextAction.action}` : null;
  const isRunningNext = runningAction === nextActionKey;

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
        <select
          value={item.status}
          onChange={(e) => onStatusChange(item.id, e.target.value as ConsultItem["status"])}
          className="w-full cursor-pointer rounded border border-line bg-bg-2 px-2 py-1 text-[11px] text-fg outline-none hover:border-line-2 focus:border-accent"
        >
          {(["todo", "doing", "waiting", "done"] as const).map((s) => (
            <option key={s} value={s}>
              {statusLabel[s]}
            </option>
          ))}
        </select>
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

      {onRunAction ? (
        <div className="mt-5">
          <div className="mb-2 text-[11px] uppercase tracking-[0.12em] text-fg-faint">
            Automated actions
          </div>
          <div className="space-y-2">
            {actionSequence.slice(0, completedCount).map(({ action, label }) => {
              const key = `${item.id}:${action}`;
              const result = actionResults?.[key];
              const isGenerating = generatingKey === key;

              return (
                <div key={action}>
                  <div className={`flex w-full items-center gap-2 rounded-md border px-3 py-2 text-left text-sm ${
                    isGenerating 
                      ? "border-line bg-bg-2 animate-pulse" 
                      : "border-line-2 bg-bg-2 text-fg-mute opacity-60"
                  }`}>
                    {isGenerating ? (
                      <>
                        <svg className="h-3 w-3 animate-spin text-fg-mute" viewBox="0 0 24 24" fill="none">
                          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="31.4" strokeDashoffset="10" />
                        </svg>
                        <span className="text-fg-dim">Generating {label.toLowerCase()}...</span>
                      </>
                    ) : (
                      <>
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          className="text-accent"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        <span>{label}</span>
                      </>
                    )}
                  </div>

                  {!isGenerating && result ? (
                    <div className="mt-2 rounded-md border border-line bg-bg-1 p-3">
                      <div className="mb-2 whitespace-pre-wrap text-[12px] leading-relaxed text-fg">
                        {result.content}
                      </div>
                      {result.suggestedNext ? (
                        <div className="mt-2 border-t border-line pt-2 text-[11px] text-fg-mute">
                          <span className="text-accent">Next: </span>
                          {result.suggestedNext}
                        </div>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              );
            })}

            {showNextDelay && completedCount < actionSequence.length && (
              <div className="flex items-center gap-2 rounded-md border border-line bg-bg-2 px-3 py-2">
                <svg className="h-3 w-3 animate-spin text-fg-mute" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="31.4" strokeDashoffset="10" />
                </svg>
                <span className="text-sm text-fg-mute">Preparing next action...</span>
              </div>
            )}

            {nextAction && !showNextDelay && (
              <button
                type="button"
                onClick={() =>
                  setActionToConfirm({ itemId: item.id, action: nextAction.action, label: nextAction.label })
                }
                disabled={isRunningNext}
                className="relative w-full rounded-md border border-line bg-bg-2 px-3 py-2 text-left text-sm text-fg-dim transition hover:border-line-2 hover:text-fg disabled:cursor-not-allowed disabled:opacity-60"
              >
                <div className="flex items-center gap-2">
                  {isRunningNext ? (
                    <svg
                      className="h-3 w-3 animate-spin text-fg-mute"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeDasharray="31.4"
                        strokeDashoffset="10"
                      />
                    </svg>
                  ) : (
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="text-fg-mute"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                  )}
                  <span>{isRunningNext ? "Running…" : nextAction.label}</span>
                </div>
              </button>
            )}

            {completedCount >= actionSequence.length && item.status !== "done" && !actionsComplete && (
              <div className="mt-3 rounded-md border border-dashed border-line bg-bg-1 p-3">
                <div className="text-center">
                  <div className="text-[11px] text-fg-faint">All actions completed</div>
                  <button
                    type="button"
                    onClick={() => {
                      setActionsComplete(true);
                      onActionsComplete?.(item.id);
                    }}
                    className="mt-2 rounded-md border border-accent px-3 py-1.5 text-sm text-accent transition hover:bg-accent hover:text-bg"
                  >
                    Update status to "Done"
                  </button>
                </div>
              </div>
            )}

            {(actionsComplete || item.status === "done") && (
              <div className="mt-3 flex items-center justify-center rounded-md border border-accent bg-bg-2 px-3 py-2">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-accent mr-2">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span className="text-sm text-accent">Status updated to Done</span>
              </div>
            )}
          </div>
        </div>
      ) : null}

      {actionToConfirm ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-[320px] rounded-lg border border-line bg-bg-2 p-4 shadow-xl">
            <div className="text-base font-semibold text-fg">Run "{actionToConfirm.label}"?</div>
            <div className="mt-2 text-sm text-fg-dim">
              This will generate a {actionToConfirm.label.toLowerCase()} for this item.
            </div>
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => {
                  const key = `${actionToConfirm.itemId}:${actionToConfirm.action}`;
                  setGeneratingKey(key);
                  onRunAction?.(actionToConfirm.itemId, actionToConfirm.action);
                  setActionToConfirm(null);
                  setShowNextDelay(true);
                  window.setTimeout(() => {
                    setShowNextDelay(false);
                    setGeneratingKey(null);
                  }, 2000);
                }}
                className="flex-1 rounded-md bg-accent px-3 py-2 text-sm font-semibold text-bg transition hover:brightness-110"
              >
                Run
              </button>
              <button
                type="button"
                onClick={() => setActionToConfirm(null)}
                className="flex-1 rounded-md border border-line bg-bg-1 px-3 py-2 text-sm text-fg-dim transition hover:border-line-2 hover:text-fg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <div className="mt-4 flex gap-2">
        {onToggleDigest ? (
          <button
            type="button"
            onClick={() => {
              onToggleDigest(item.id);
              if (!inDigest) {
                onBack();
              }
            }}
            className={`flex-1 rounded-md px-3 py-2 text-sm font-semibold transition ${
              inDigest
                ? "border border-line bg-bg-1 text-fg-dim hover:border-line-2 hover:text-fg"
                : "bg-accent text-bg hover:brightness-110"
            }`}
          >
            {inDigest ? "In digest ✓" : "Add to digest"}
          </button>
        ) : null}
        <button
          type="button"
          onClick={onBack}
          className="flex-1 rounded-md border border-line bg-bg-1 px-3 py-2 text-sm text-fg-dim transition hover:border-line-2 hover:text-fg"
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
  digestIds,
  selectedItem,
  onBack,
  onStatusChange,
  onSelectItem,
  onToggleDigest,
  onGenerateSummary,
  onSendEmail,
  isGeneratingSummary = false,
  isSendingEmail = false,
  isSummarizingDelay = false,
  emailSent = false,
  showEmailPreview = false,
  emailPreviewContent,
  actionResults,
  runningAction,
  onRunAction,
  onActionsComplete,
  onConfirmSendEmail,
  onCancelSendEmail,
}: RightPanelProps) {
  const [copied, setCopied] = useState(false);

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
            </>
          ) : null}
        </span>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {selectedItem ? (
          <DetailMode
            item={selectedItem}
            onBack={onBack}
            inDigest={digestIds.includes(selectedItem.id)}
            onToggleDigest={onToggleDigest}
            onStatusChange={onStatusChange}
            actionResults={actionResults}
            runningAction={runningAction}
            onRunAction={onRunAction}
            onActionsComplete={onActionsComplete}
          />
        ) : (
          <SummaryMode
            items={items}
            summary={summary}
            digestIds={digestIds}
            onGenerateSummary={onGenerateSummary}
            onSendEmail={onSendEmail}
            isGeneratingSummary={isGeneratingSummary}
            isSendingEmail={isSendingEmail}
            isSummarizingDelay={isSummarizingDelay}
            emailSent={emailSent}
            showEmailPreview={showEmailPreview}
            emailPreviewContent={emailPreviewContent}
            onSelectItem={onSelectItem}
            onConfirmSendEmail={onConfirmSendEmail}
            onCancelSendEmail={onCancelSendEmail}
          />
        )}
      </div>
    </aside>
  );
}
