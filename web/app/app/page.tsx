"use client";

import type { CSSProperties } from "react";
import { useCallback, useMemo, useState } from "react";

import Board from "@/components/Board";
import InputPanel, {
  type InputHighlight,
  type SourceTab,
} from "@/components/InputPanel";
import LoadingOverlay from "@/components/LoadingOverlay";
import RightPanel from "@/components/RightPanel";
import Sidebar from "@/components/Sidebar";
import type {
  ConsultItem,
  ExtractResponse,
  Stats,
  SummarizeResponse,
  SummaryData,
} from "@/types/schema";
import type { AutoActionResult } from "@/lib/mocks";

const initialTranscript = `Client would like the Q3 operating review in final form by next Thursday.

Maya will send the updated churn workbook after finance closes the month.

We still need confirmation from the client PM on rollout sequencing for the pilot markets.

There is a risk that legal review slips if procurement redlines are not resolved this week.
`;

const initialSourceText: Record<SourceTab, string> = {
  Transcript: initialTranscript,
  Email: `From: Sarah Chen <s.chen@acmecorp.com>
To: Consulting team
Subject: RE: Commercial strategy workstream — quick update

Hi team, following up on our call. A few things:

Legal has flagged the vendor contract renewal — we need sign-off from procurement before we can proceed. Targeting end of next week but this is at risk.

Can someone own the competitive benchmarking deck? We promised the board a first draft by May 2.

Also waiting on Marcus to confirm the go-live date for the APAC rollout. He was supposed to revert by yesterday.`,
  Notes: `Whiteboard session — Apr 23

Three priority areas agreed:
- Pricing model needs rework before board presentation (owner: TBD, due May 5)
- NPS data from Q2 still missing — blocked on analytics team access
- Draft exec summary for CFO review by Apr 28 — JS taking point

Open question: do we expand scope to include LATAM? Client leaning yes but no budget confirmed.`,
};

const emptyStats: Stats = {
  total: 0,
  waiting: 0,
  blockers: 0,
  risks: 0,
};

function computeStats(nextItems: ConsultItem[]): Stats {
  return {
    total: nextItems.length,
    waiting: nextItems.filter((item) => item.waiting).length,
    blockers: nextItems.filter((item) => item.kind === "blocker").length,
    risks: nextItems.filter((item) => item.kind === "risk").length,
  };
}

const seedItems: ConsultItem[] = [
  {
    id: "ACM-090",
    title: "Confirm stakeholder list for steering committee",
    kind: "task",
    status: "todo",
    owner: "JS",
    ownerName: "Jordan S.",
    due: "Mon",
    dueFlag: "soon",
    tags: ["stakeholders", "governance"],
    waiting: false,
    quote: null,
  },
  {
    id: "ACM-091",
    title: "Client to share Q2 NPS raw export",
    kind: "waiting",
    status: "waiting",
    owner: "CL",
    ownerName: "Client Lead (client)",
    due: "ASAP",
    dueFlag: null,
    tags: ["data", "from-client"],
    waiting: true,
    quote: null,
  },
  {
    id: "ACM-092",
    title: "Flag scope creep risk on LATAM add-on",
    kind: "risk",
    status: "todo",
    owner: "PM",
    ownerName: "Program Mgmt",
    due: "This week",
    dueFlag: "soon",
    tags: ["scope", "risk"],
    waiting: false,
    quote: null,
  },
];

const seedStats = computeStats(seedItems);

const loadingStepDurations = [600, 600, 600];
const minimumParseOverlayMs = 2600;

function delay(ms: number) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sourcePanelOpen, setSourcePanelOpen] = useState(true);
  const [hasParsed, setHasParsed] = useState(true);
  const [sourceText, setSourceText] =
    useState<Record<SourceTab, string>>(initialSourceText);
  const [activeTab, setActiveTab] = useState<SourceTab>("Transcript");
  const [items, setItems] = useState<ConsultItem[]>(seedItems);
  const [stats, setStats] = useState<Stats>(seedStats);
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [digestIds, setDigestIds] = useState<string[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [summaryError, setSummaryError] = useState<string | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailResult, setEmailResult] = useState<{ tone: string } | null>(null);
  const [actionResults, setActionResults] = useState<
    Record<string, AutoActionResult>
  >({});
  const [runningAction, setRunningAction] = useState<string | null>(null);

  const currentSourceText = sourceText[activeTab];
  const selectedItem = useMemo(
    () => items.find((item) => item.id === selectedId) ?? null,
    [items, selectedId],
  );

  const showRightPanel = hasParsed && (selectedId !== null || !sourcePanelOpen);
  const transcriptHighlights = useMemo<InputHighlight[]>(
    () =>
      items
        .filter((item) => item.quote)
        .map((item) => ({
          id: item.id,
          kind: item.kind,
          quote: item.quote ?? "",
        })),
    [items],
  );
  const densityClass = "gap-4 p-4";

  const shellStyle = useMemo<CSSProperties>(
    () =>
      ({
        "--sidebar-w": sidebarOpen ? "232px" : "48px",
      }) as CSSProperties,
    [sidebarOpen],
  );

  const workspaceStyle = useMemo<CSSProperties>(
    () =>
      ({
        "--source-w": sourcePanelOpen ? "360px" : "0px",
        "--right-w": showRightPanel ? "360px" : "0px",
      }) as CSSProperties,
    [showRightPanel, sourcePanelOpen],
  );

  const updateSourceText = useCallback(
    (value: string) => {
      setSourceText((current) => ({
        ...current,
        [activeTab]: value,
      }));
    },
    [activeTab],
  );

  const handleBoardSelect = useCallback((id: string) => {
    setSelectedId(id);
    setSourcePanelOpen(false);
  }, []);

  const handleHighlightSelect = useCallback((id: string) => {
    setActiveTab("Transcript");
    setSelectedId(id);
  }, []);

  const handleBack = useCallback(() => {
    setSelectedId(null);
  }, []);

  const handleSelectItem = useCallback((id: string) => {
    setSelectedId(id);
  }, []);

  const toggleDigest = useCallback((id: string) => {
    setDigestIds((current) =>
      current.includes(id) ? current.filter((existing) => existing !== id) : [...current, id],
    );
  }, []);

  const generateSummary = useCallback(async (nextItems: ConsultItem[]) => {
    if (nextItems.length === 0) {
      setSummary(null);
      setSummaryError(null);
      return;
    }

    setSummaryError(null);

    const response = await fetch("/api/summarize", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ items: nextItems }),
    });

    const payload = (await response.json()) as SummarizeResponse & { error?: string };

    if (!response.ok) {
      throw new Error(payload.error ?? "Failed to generate executive summary.");
    }

    setSummary(payload);
  }, []);

  const handleAddItem = useCallback(
    (status: ConsultItem["status"], title: string) => {
      const nextItem: ConsultItem = {
        id: `MAN-${Date.now()}`,
        title,
        kind: status === "waiting" ? "waiting" : "task",
        status,
        owner: "ME",
        ownerName: "Me",
        due: "",
        dueFlag: null,
        tags: ["manual"],
        waiting: status === "waiting",
        quote: null,
      };

      setItems((current) => {
        const next = [...current, nextItem];
        setStats(computeStats(next));
        return next;
      });
    },
    [],
  );

  const handleStatusChange = useCallback(
    (id: string, status: ConsultItem["status"]) => {
      setItems((current) => {
        const next = current.map((item) =>
          item.id === id ? { ...item, status, waiting: status === "waiting" } : item,
        );
        setStats(computeStats(next));
        return next;
      });
    },
    [],
  );

  const handleSendEmail = useCallback(async () => {
    if (emailResult || isSendingEmail) return;

    setIsSendingEmail(true);
    await new Promise((r) => setTimeout(r, 1200));
    setEmailResult({ tone: "Formal" });
    setIsSendingEmail(false);
  }, [emailResult, isSendingEmail]);

  const parseSourceTab = useCallback(
    async (tab: SourceTab) => {
      const input = sourceText[tab].trim();

      if (!input || isParsing) {
        return;
      }

      setIsParsing(true);
      setCurrentStep(0);
      setErrorMessage(null);
      setSummaryError(null);
      setSelectedId(null);
      setSummary(null);
      setDigestIds([]);

      const stepTimers = loadingStepDurations.map((duration, index) =>
        window.setTimeout(() => {
          setCurrentStep(index + 1);
        }, loadingStepDurations.slice(0, index + 1).reduce((sum, value) => sum + value, 0)),
      );

      try {
        const [response] = await Promise.all([
          fetch("/api/extract", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ input }),
          }),
          delay(minimumParseOverlayMs),
        ]);

        const payload = (await response.json()) as ExtractResponse & { error?: string };

        if (!response.ok) {
          throw new Error(payload.error ?? "Failed to extract structured items.");
        }

        setSourcePanelOpen(false);
        setHasParsed(true);

        setItems((current) => {
          const map = new Map(current.map((item) => [item.id, item] as const));
          for (const item of payload.items) {
            map.set(item.id, item);
          }
          const merged = Array.from(map.values());
          setStats(computeStats(merged));
          return merged;
        });
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : "Unexpected extraction error.",
        );
      } finally {
        stepTimers.forEach((timer) => window.clearTimeout(timer));
        setIsParsing(false);
        setCurrentStep(0);
      }
    },
    [generateSummary, isParsing, sourceText],
  );

  const handleGenerateSummary = useCallback(async () => {
    if (isSummarizing) {
      return;
    }

    setIsSummarizing(true);
    setSummaryError(null);

    try {
      const digestItems = digestIds
        .map((id) => items.find((item) => item.id === id))
        .filter((item): item is ConsultItem => Boolean(item));
      await generateSummary(digestItems);
    } catch (error) {
      setSummaryError(
        error instanceof Error ? error.message : "Unexpected summarization error.",
      );
    } finally {
      setIsSummarizing(false);
    }
  }, [digestIds, generateSummary, isSummarizing, items]);

  const handleRunAction = useCallback(
    async (itemId: string, action: string) => {
      const key = `${itemId}:${action}`;

      if (runningAction !== null) {
        return;
      }

      setRunningAction(key);

      try {
        const item = items.find((i) => i.id === itemId);

        const response = await fetch("/api/auto-action", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ item, action }),
        });

        const payload = (await response.json()) as AutoActionResult & {
          error?: string;
        };

        if (!response.ok) {
          throw new Error(payload.error ?? "Failed to run auto-action.");
        }

        setActionResults((current) => ({
          ...current,
          [key]: payload,
        }));
      } catch (error) {
        setActionResults((current) => ({
          ...current,
          [key]: {
            actionType: action,
            label: "Error",
            content:
              error instanceof Error ? error.message : "Unexpected error.",
            suggestedNext: "",
          },
        }));
      } finally {
        setRunningAction(null);
      }
    },
    [items, runningAction],
  );

  const handleTabChange = useCallback((tab: SourceTab) => {
    setActiveTab(tab);
    setErrorMessage(null);
  }, []);

  const handleParse = useCallback(async () => {
    await parseSourceTab(activeTab);
  }, [activeTab, parseSourceTab]);

  return (
    <main
      className="relative h-screen overflow-hidden bg-bg p-3 text-fg"
    >
      <div
        className="grid h-full grid-cols-[var(--sidebar-w)_1fr] overflow-hidden rounded-shell border border-line bg-bg transition-[grid-template-columns] duration-200"
        style={shellStyle}
      >
        <Sidebar
          items={items}
          collapsed={!sidebarOpen}
          onToggle={() => setSidebarOpen((current) => !current)}
        />

        <section className="grid min-h-0 min-w-0 grid-rows-[44px_1fr]">
          <div className="flex items-center gap-3 border-b border-line px-4">
            {!sourcePanelOpen ? (
              <button
                type="button"
                onClick={() => setSourcePanelOpen(true)}
                className="rounded-md border border-line bg-bg-2 px-2.5 py-1 text-xs text-fg-dim transition hover:border-line-2 hover:text-fg"
              >
                Add source
              </button>
            ) : null}
            <div>
              <div className="flex items-center gap-2 text-sm text-fg-dim">
                <span>Acme Corp</span>
                <span className="text-fg-faint">/</span>
                <span>Commercial strategy</span>
                <span className="text-fg-faint">/</span>
                <span className="text-fg">Q3 operating review</span>
              </div>
              <div className="mt-0.5 text-[11px] uppercase tracking-[0.14em] text-fg-faint">
                Session · Steering sync 14
              </div>
            </div>
          </div>

          <div
            className={`grid min-h-0 min-w-0 grid-cols-[var(--source-w)_1fr_var(--right-w)] ${densityClass}`}
            style={workspaceStyle}
          >
            <div
              className="min-h-0 overflow-hidden transition-[width] duration-200"
              style={{ width: "var(--source-w)" }}
            >
              <InputPanel
                value={currentSourceText}
                onChange={updateSourceText}
                onParse={handleParse}
                isParsing={isParsing}
                activeTab={activeTab}
                onTabChange={handleTabChange}
                onToggle={() => setSourcePanelOpen(false)}
                attn
                highlights={transcriptHighlights}
                onHighlightSelect={handleHighlightSelect}
              />
            </div>

            <div className="min-h-0">
              <Board
                items={items}
                selectedId={selectedId}
                onSelect={handleBoardSelect}
                onAddItem={handleAddItem}
                onStatusChange={handleStatusChange}
                loading={isParsing}
              />
              {errorMessage ? (
                <div className="mt-3 rounded-[8px] border border-[var(--danger-weak)] bg-[rgba(72,25,28,0.55)] px-3 py-2 text-sm text-danger">
                  {errorMessage}
                </div>
              ) : null}
            </div>

            <div
              className="min-h-0 overflow-hidden transition-[width] duration-200"
              style={{ width: "var(--right-w)" }}
            >
              {showRightPanel ? (
                <>
                  <RightPanel
                    items={items}
                    summary={summary}
                    digestIds={digestIds}
                    selectedItem={selectedItem}
                    onBack={handleBack}
                    onStatusChange={handleStatusChange}
                    onSelectItem={handleSelectItem}
                    onToggleDigest={toggleDigest}
                    onGenerateSummary={handleGenerateSummary}
                    onSendEmail={handleSendEmail}
                    isGeneratingSummary={isSummarizing}
                    isSendingEmail={isSendingEmail}
                    emailSent={!!emailResult}
                    actionResults={actionResults}
                    runningAction={runningAction}
                    onRunAction={handleRunAction}
                  />
                  {summaryError ? (
                    <div className="mt-3 rounded-[8px] border border-[var(--warn-weak)] bg-[rgba(65,46,17,0.5)] px-3 py-2 text-sm text-warn">
                      {summaryError}
                    </div>
                  ) : null}
                </>
              ) : null}
            </div>
          </div>
        </section>
      </div>

      <LoadingOverlay visible={isParsing} currentStep={currentStep} />
    </main>
  );
}
