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

const initialTranscript = `Client would like the Q3 operating review in final form by next Thursday.

Maya will send the updated churn workbook after finance closes the month.

We still need confirmation from the client PM on rollout sequencing for the pilot markets.

There is a risk that legal review slips if procurement redlines are not resolved this week.
`;

const initialSourceText: Record<SourceTab, string> = {
  Transcript: initialTranscript,
  Email: "",
  Notes: "",
};

const emptyStats: Stats = {
  total: 0,
  waiting: 0,
  blockers: 0,
  risks: 0,
};

const loadingStepDurations = [375, 375, 375];
const viewTabs = ["Board", "List", "Timeline"] as const;
const accentThemes = {
  blue: {
    accent: "#7c7aff",
    weak: "rgba(124,122,255,0.14)",
    glow: "rgba(124,122,255,0.32)",
  },
  amber: {
    accent: "#f59e0b",
    weak: "rgba(245,158,11,0.16)",
    glow: "rgba(245,158,11,0.3)",
  },
  mint: {
    accent: "#10b981",
    weak: "rgba(16,185,129,0.16)",
    glow: "rgba(16,185,129,0.3)",
  },
} as const;

function delay(ms: number) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

export default function Home() {
  const [sourceText, setSourceText] =
    useState<Record<SourceTab, string>>(initialSourceText);
  const [activeTab, setActiveTab] = useState<SourceTab>("Transcript");
  const [items, setItems] = useState<ConsultItem[]>([]);
  const [stats, setStats] = useState<Stats>(emptyStats);
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [summaryError, setSummaryError] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<(typeof viewTabs)[number]>("Board");
  const [density, setDensity] = useState<"comfortable" | "compact">("comfortable");
  const [accentTheme, setAccentTheme] =
    useState<keyof typeof accentThemes>("blue");

  const currentSourceText = sourceText[activeTab];
  const selectedItem = useMemo(
    () => items.find((item) => item.id === selectedId) ?? null,
    [items, selectedId],
  );
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
  const densityClass =
    density === "compact" ? "gap-3 p-3" : "gap-4 p-4";
  const themeStyle = useMemo<CSSProperties>(
    () =>
      ({
        "--accent": accentThemes[accentTheme].accent,
        "--accent-weak": accentThemes[accentTheme].weak,
        "--accent-glow": accentThemes[accentTheme].glow,
      }) as CSSProperties,
    [accentTheme],
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

  const handleTabChange = useCallback((tab: SourceTab) => {
    setActiveTab(tab);
    setErrorMessage(null);
  }, []);

  const handleBoardSelect = useCallback((id: string) => {
    setSelectedId(id);
  }, []);

  const handleHighlightSelect = useCallback((id: string) => {
    setActiveTab("Transcript");
    setSelectedId(id);
  }, []);

  const handleBack = useCallback(() => {
    setSelectedId(null);
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

  const handleRegenerateSummary = useCallback(async () => {
    if (items.length === 0 || isRegenerating || isParsing) {
      return;
    }

    setIsRegenerating(true);

    try {
      await generateSummary(items);
    } catch (error) {
      setSummaryError(
        error instanceof Error ? error.message : "Unexpected summarization error.",
      );
    } finally {
      setIsRegenerating(false);
    }
  }, [generateSummary, isParsing, isRegenerating, items]);

  const handleParse = useCallback(async () => {
    const input = sourceText[activeTab].trim();

    if (!input || isParsing) {
      return;
    }

    setIsParsing(true);
    setCurrentStep(0);
    setErrorMessage(null);
    setSummaryError(null);
    setSelectedId(null);
    setSummary(null);

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
        delay(1500),
      ]);

      const payload = (await response.json()) as ExtractResponse & { error?: string };

      if (!response.ok) {
        throw new Error(payload.error ?? "Failed to extract structured items.");
      }

      setItems(payload.items);
      setStats(payload.stats);

      try {
        await generateSummary(payload.items);
      } catch (error) {
        setSummaryError(
          error instanceof Error ? error.message : "Unexpected summarization error.",
        );
      }
    } catch (error) {
      setItems([]);
      setStats(emptyStats);
      setErrorMessage(
        error instanceof Error ? error.message : "Unexpected extraction error.",
      );
    } finally {
      stepTimers.forEach((timer) => window.clearTimeout(timer));
      setIsParsing(false);
      setCurrentStep(0);
    }
  }, [activeTab, generateSummary, isParsing, sourceText]);

  return (
    <main
      className="relative h-screen overflow-hidden bg-bg p-3 text-fg"
      style={themeStyle}
    >
      <div className="grid h-full grid-cols-[232px_1fr] overflow-hidden rounded-shell border border-line bg-bg">
        <Sidebar items={items} />

        <section className="grid min-h-0 min-w-0 grid-rows-[44px_1fr]">
          <div className="flex items-center gap-3 border-b border-line px-4">
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
            <div className="ml-auto flex items-center rounded-md border border-line bg-bg-1 p-1 text-xs text-fg-dim">
              {viewTabs.map((tab) => {
                const isActive = tab === activeView;

                return (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveView(tab)}
                    className={`rounded px-2 py-1 transition ${
                      isActive
                        ? "bg-bg-2 text-fg shadow-[0_0_0_1px_var(--accent-glow)]"
                        : "text-fg-dim hover:text-fg"
                    }`}
                  >
                    {tab}
                  </button>
                );
              })}
            </div>
          </div>

          <div className={`grid min-h-0 min-w-0 grid-cols-[360px_1fr_300px] ${densityClass}`}>
            <div className="min-h-0">
              <InputPanel
                value={currentSourceText}
                onChange={updateSourceText}
                onParse={handleParse}
                isParsing={isParsing}
                activeTab={activeTab}
                onTabChange={handleTabChange}
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
                loading={isParsing}
              />
              {errorMessage ? (
                <div className="mt-3 rounded-[8px] border border-[var(--danger-weak)] bg-[rgba(72,25,28,0.55)] px-3 py-2 text-sm text-danger">
                  {errorMessage}
                </div>
              ) : null}
            </div>

            <div className="min-h-0">
              <RightPanel
                items={items}
                summary={summary}
                selectedItem={selectedItem}
                onBack={handleBack}
                onRegenerate={handleRegenerateSummary}
                isRegenerating={isRegenerating}
              />
              {summaryError ? (
                <div className="mt-3 rounded-[8px] border border-[var(--warn-weak)] bg-[rgba(65,46,17,0.5)] px-3 py-2 text-sm text-warn">
                  {summaryError}
                </div>
              ) : null}
              {stats.total > 0 ? (
                <div className="mt-3 rounded-[8px] border border-line bg-bg-1 px-3 py-2 text-[11px] text-fg-dim">
                  {stats.total} items parsed · {stats.waiting} waiting · {stats.blockers} blockers
                  · {stats.risks} risks
                </div>
              ) : null}
              <div className="mt-3 rounded-[8px] border border-line bg-bg-1 p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[11px] uppercase tracking-[0.12em] text-fg-faint">
                      Tweaks
                    </div>
                    <div className="mt-1 text-sm font-medium text-fg">
                      Demo controls
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleParse}
                    disabled={isParsing || currentSourceText.trim().length === 0}
                    className="rounded-md border border-line bg-bg-2 px-2.5 py-1.5 text-[11px] text-fg-dim transition hover:border-line-2 hover:text-fg disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Replay parse
                  </button>
                </div>

                <div className="mt-4">
                  <div className="text-[11px] uppercase tracking-[0.12em] text-fg-faint">
                    Accent
                  </div>
                  <div className="mt-2 flex gap-2">
                    {(Object.keys(accentThemes) as Array<keyof typeof accentThemes>).map(
                      (theme) => (
                        <button
                          key={theme}
                          type="button"
                          onClick={() => setAccentTheme(theme)}
                          className={`h-7 w-7 rounded-full border transition ${
                            accentTheme === theme
                              ? "border-fg shadow-[0_0_0_1px_var(--accent-glow)]"
                              : "border-line hover:border-line-2"
                          }`}
                          style={{ backgroundColor: accentThemes[theme].accent }}
                          aria-label={`Use ${theme} accent`}
                        />
                      ),
                    )}
                  </div>
                </div>

                <div className="mt-4">
                  <div className="text-[11px] uppercase tracking-[0.12em] text-fg-faint">
                    Density
                  </div>
                  <div className="mt-2 flex rounded-md border border-line bg-bg-2 p-1 text-[11px] text-fg-dim">
                    {(["comfortable", "compact"] as const).map((mode) => (
                      <button
                        key={mode}
                        type="button"
                        onClick={() => setDensity(mode)}
                        className={`flex-1 rounded px-2 py-1 transition ${
                          density === mode
                            ? "bg-bg-3 text-fg"
                            : "hover:text-fg"
                        }`}
                      >
                        {mode === "comfortable" ? "Comfortable" : "Compact"}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <LoadingOverlay visible={isParsing} currentStep={currentStep} />
    </main>
  );
}
