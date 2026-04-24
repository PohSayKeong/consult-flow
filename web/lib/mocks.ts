import type { ConsultItem, Stats, ClientDigest, SummaryData } from "@/types/schema";

export const MOCK_ITEMS: ConsultItem[] = [
  {
    id: "ACM-101",
    title: "Deliver Q3 operating review in final form",
    kind: "task",
    status: "todo",
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
    title: "Send updated churn workbook after month close",
    kind: "task",
    status: "doing",
    owner: "MA",
    ownerName: "Maya A.",
    due: "Month close",
    dueFlag: null,
    tags: ["finance", "churn"],
    waiting: false,
    quote: "Maya will send the updated churn workbook after finance closes the month.",
  },
  {
    id: "ACM-103",
    title: "Confirm pilot market rollout sequencing",
    kind: "waiting",
    status: "waiting",
    owner: "CPM",
    ownerName: "Client PM (client)",
    due: "",
    dueFlag: null,
    tags: ["rollout", "from-client"],
    waiting: true,
    quote: "We still need confirmation from the client PM on rollout sequencing for the pilot markets.",
  },
  {
    id: "ACM-104",
    title: "Resolve procurement redlines before legal review",
    kind: "risk",
    status: "todo",
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
    '<p>The engagement is <span class="em">broadly on track</span>, with the Q3 operating review and churn workbook as the two primary deliverables in motion. Maya\'s team is actively progressing both workstreams ahead of the month-close gate.</p>' +
    '<p>Forward progress is gated by <span class="em-warn">one outstanding client input</span>: confirmation from the client PM on pilot market rollout sequencing, which has no committed deadline and is blocking downstream planning.</p>' +
    '<p>An <span class="em-risk">unresolved procurement redlines risk</span> threatens the legal review timeline; if redlines are not cleared this week, the review will slip and compress the overall delivery schedule.</p>',
  clientDigest: {
    nextFromClient:
      "Please confirm pilot market rollout sequencing at your earliest convenience — this is blocking our planning.",
    nextFromUs:
      "We will deliver the Q3 operating review in final form by next Thursday and the updated churn workbook following month close.",
    flags:
      "Procurement redlines must be resolved this week to avoid a legal review slip that would compress the delivery schedule.",
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
