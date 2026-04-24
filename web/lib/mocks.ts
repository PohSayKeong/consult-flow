import type { ConsultItem, Stats, ClientDigest, SummaryData } from "@/types/schema";

function escapeHtml(input: string) {
  return input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function pickTitles(items: ConsultItem[], limit: number) {
  return items
    .map((item) => escapeHtml(item.title))
    .filter(Boolean)
    .slice(0, limit);
}

export function buildMockSummary(items: ConsultItem[]): SummaryData {
  const total = items.length;

  const byStatus = {
    todo: items.filter((i) => i.status === "todo"),
    doing: items.filter((i) => i.status === "doing"),
    waiting: items.filter((i) => i.status === "waiting"),
    done: items.filter((i) => i.status === "done"),
  };

  const risks = items.filter((i) => i.kind === "risk");
  const blockers = items.filter((i) => i.kind === "blocker");
  const waitingOnClient = items.filter((i) => i.waiting || i.status === "waiting");

  const highlights = pickTitles([...byStatus.doing, ...byStatus.todo], 2);
  const waitingHighlights = pickTitles(waitingOnClient, 2);
  const riskHighlights = pickTitles([...blockers, ...risks], 2);

  const execSummaryParts: string[] = [];

  execSummaryParts.push(
    `<p>Digest includes <span class="em">${total} item${total === 1 ? "" : "s"}</span>: ${byStatus.doing.length} in progress, ${byStatus.todo.length} queued, ${byStatus.done.length} done.</p>`,
  );

  if (highlights.length > 0) {
    execSummaryParts.push(
      `<p>Primary focus: <span class="em">${highlights.join("; ")}</span>.</p>`,
    );
  }

  if (waitingOnClient.length > 0) {
    execSummaryParts.push(
      `<p>Progress depends on <span class="em-warn">${waitingOnClient.length} client input${waitingOnClient.length === 1 ? "" : "s"}</span>${
        waitingHighlights.length > 0 ? `: ${waitingHighlights.join("; ")}.` : "."
      }</p>`,
    );
  }

  if (blockers.length > 0 || risks.length > 0) {
    execSummaryParts.push(
      `<p>Watchouts: <span class="em-risk">${blockers.length} blocker${blockers.length === 1 ? "" : "s"}</span> and <span class="em-risk">${risks.length} risk${risks.length === 1 ? "" : "s"}</span>${
        riskHighlights.length > 0 ? ` — ${riskHighlights.join("; ")}.` : "."
      }</p>`,
    );
  }

  const nextFromClient =
    waitingOnClient.length > 0
      ? `Please provide: ${pickTitles(waitingOnClient, 3).join("; ")}.`
      : "No client dependencies flagged in the digest.";

  const nextFromUs =
    highlights.length > 0
      ? `We will progress: ${highlights.join("; ")}.`
      : "We will progress the next queued items in the digest.";

  const flags =
    riskHighlights.length > 0
      ? `Watchouts: ${riskHighlights.join("; ")}.`
      : "No blockers/risks flagged in the digest.";

  return {
    execSummary: execSummaryParts.join(""),
    clientDigest: {
      nextFromClient,
      nextFromUs,
      flags,
    } satisfies ClientDigest,
    provenance: `Mock summary · ${new Date().toLocaleDateString()} · ${total} digest item${total === 1 ? "" : "s"}`,
  };
}

export const MOCK_ITEMS: ConsultItem[] = [
  {
    id: "ACM-101",
    title: "Complete Q3 operating review deck for board",
    kind: "task",
    status: "doing",
    owner: "MA",
    ownerName: "Maya A.",
    due: "Next Thu",
    dueFlag: "soon",
    tags: ["deliverable", "review"],
    waiting: false,
    quote: "Client would like the Q3 operating review in final form by next Thursday.",
  },
  {
    id: "ACM-102",
    title: "Fix data export pipeline for churn metrics",
    kind: "blocker",
    status: "doing",
    owner: "TK",
    ownerName: "Tom K.",
    due: "Tomorrow",
    dueFlag: "overdue",
    tags: ["technical", "data"],
    waiting: false,
    quote: "The churn metrics export is failing — Tom is investigating the schema mismatch in the data pipeline.",
  },
  {
    id: "ACM-103",
    title: "Get Q2 NPS raw export from client",
    kind: "waiting",
    status: "waiting",
    owner: "JS",
    ownerName: "Jordan S.",
    due: "This week",
    dueFlag: "soon",
    tags: ["Q2 NPS"],
    waiting: true,
    quote: "Q2 NPS raw export needed for the sentiment analysis — client to provide.",
  },
  {
    id: "ACM-104",
    title: "Schedule team retrospective for Q3 learnings",
    kind: "task",
    status: "todo",
    owner: "MA",
    ownerName: "Maya A.",
    due: "This Fri",
    dueFlag: "soon",
    tags: ["team", "process"],
    waiting: false,
    quote: "Need to schedule the Q3 retro before the engagement wraps.",
  },
  {
    id: "ACM-105",
    title: "Update stakeholder contact list with new hires",
    kind: "task",
    status: "todo",
    owner: "JR",
    ownerName: "Jordan R.",
    due: "Next week",
    dueFlag: null,
    tags: ["admin", "stakeholders"],
    waiting: false,
    quote: "Three new hires need to be added to the stakeholder distribution list.",
  },
  {
    id: "ACM-106",
    title: "Verify API integration with finance system",
    kind: "task",
    status: "todo",
    owner: "TK",
    ownerName: "Tom K.",
    due: "End of sprint",
    dueFlag: null,
    tags: ["technical", "integration"],
    waiting: false,
    quote: "The finance system API sync needs end-to-end verification before go-live.",
  },
  {
    id: "ACM-107",
    title: "Risky: vendor contract may slip if redlines unresolved",
    kind: "risk",
    status: "doing",
    owner: "LG",
    ownerName: "Legal team",
    due: "This week",
    dueFlag: "soon",
    tags: ["legal", "risk"],
    waiting: false,
    quote: "There is a risk that legal review slips if procurement redlines are not resolved this week.",
  },
];

export const MOCK_STATS: Stats = {
  total: MOCK_ITEMS.length,
  waiting: MOCK_ITEMS.filter((i) => i.waiting).length,
  blockers: MOCK_ITEMS.filter((i) => i.kind === "blocker").length,
  risks: MOCK_ITEMS.filter((i) => i.kind === "risk").length,
};

export const MOCK_SUMMARY: SummaryData = {
  execSummary:
    '<p>The engagement is <span class="em">broadly on track</span>. Primary focus is on the Q3 operating review (due Thursday) and resolving the data pipeline blocker that is holding up churn metrics.</p>' +
    '<p>One <span class="em-risk">active blocker</span>: the data export pipeline has a schema mismatch that Tom is investigating — this needs to be cleared before churn metrics can be generated.</p>' +
    '<p>Additional risks: <span class="em-risk">vendor contract redlines</span> must be resolved this week or legal review will slip, pushing the overall timeline.</p>',
  clientDigest: {
    nextFromClient:
      "No client inputs required at this time. All action items are internal.",
    nextFromUs:
      "We will deliver the Q3 operating review by Thursday and resolve the data pipeline blocker by end of day.",
    flags:
      "Data pipeline blocker is being worked on; vendor contract redlines need resolution this week.",
  } satisfies ClientDigest,
  provenance: "Mock data · Apr 24 · consult-flow-dev",
};

export const MOCK_EMAIL = {
  subject: "Acme Corp — Apr 24 Update: On Track, One Item Needs Your Input",
  body: `Hi Team,

The engagement is broadly on track. The Q3 operating review and churn workbook are both progressing, with delivery expected by next Thursday and month close respectively.

What we need from you:
- Confirm pilot market rollout sequencing — this is blocking downstream planning (no deadline set, needed ASAP)

What's coming from us:
- Q3 operating review (final form) — next Thursday
- Updated churn workbook — following month close

Flags:
Procurement redlines must be resolved this week or the legal review will slip. We'll flag immediately if this becomes a blocker.

Let us know if you have any questions.

[Your name]
[Firm]`,
  tone: "standard",
};

export type AutoActionResult = {
  actionType: string;
  label: string;
  content: string;
  suggestedNext: string;
};

export const MOCK_AUTO_ACTIONS: Record<string, AutoActionResult> = {
  draft_nudge: {
    actionType: "draft_nudge",
    label: "Nudge email draft",
    content: `Subject: Following up — Pilot Market Rollout Sequencing

Hi [Name],

Following our recent steering sync, we're still awaiting your confirmation on the sequencing for the pilot market rollout. This input is on the critical path for our downstream planning — without it, we can't finalise the go-live schedule or resource allocation for the launch phase.

Could you confirm the preferred sequencing by end of this week? Happy to jump on a quick call if it's easier to talk through.

[Your name]
[Firm]`,
    suggestedNext: "Send this email to the client PM and set a 48-hour follow-up reminder.",
  },
  draft_memo: {
    actionType: "draft_memo",
    label: "Action memo",
    content: `Action Memo — Deliver Q3 Operating Review in Final Form

Owner: Maya A.
Due: Next Thursday

Context: The client has requested the Q3 operating review in final form ahead of the board presentation. This is a committed deliverable from the last steering sync.

Required Actions:
• Incorporate all outstanding feedback from the draft review session
• Align financial figures with the latest month-close data
• Complete the executive summary section
• Submit for internal sign-off by Wednesday EOD

Success Criteria: Final document delivered to client stakeholders by next Thursday with all sections complete and reviewed.`,
    suggestedNext: "Share this memo with Maya A. and confirm the Wednesday internal sign-off checkpoint.",
  },
  escalation_note: {
    actionType: "escalation_note",
    label: "Escalation note",
    content: `Escalation — Resolve Procurement Redlines Before Legal Review

Situation: Procurement redlines on the vendor contract have not been resolved, blocking legal review from commencing. The redlines have been outstanding since the last working session with no confirmed owner or deadline.

Impact: If redlines are not cleared this week, legal review will slip by at least one week, compressing the overall delivery schedule and potentially pushing the contract execution past the client's target go-live date.

Ask: Sponsor intervention needed to assign a named owner for the redline resolution and set a hard deadline of Friday close.

Timeline: Urgent — action required within 24 hours to keep legal review on track.`,
    suggestedNext: "Escalate to the engagement sponsor today and request a named owner by EOD.",
  },
  risk_memo: {
    actionType: "risk_memo",
    label: "Risk memo",
    content: `Risk Note — Legal Review Slip Due to Unresolved Procurement Redlines

Risk Description: Procurement redlines on the vendor contract remain unresolved, creating a hard dependency that prevents legal review from starting. No owner has been assigned and no resolution deadline is in place.

Likelihood: High — redlines have already been outstanding for multiple days with no visible progress.

Impact: High — a legal review slip of one week or more compresses the contract execution timeline and risks missing the client's go-live target date.

Mitigation Options:
• Assign a named procurement owner with a Friday resolution deadline
• Escalate to engagement sponsor to unblock procurement decision-making
• Explore parallel legal review of non-redlined clauses to reduce total elapsed time

Owner: Legal team (LG) / Timeline: This week`,
    suggestedNext: "Add this to the steering committee risk register and flag in the next client update.",
  },
};
