"use client";

import { useState } from "react";
import InputPanel, { SourceTab } from "@/components/InputPanel";
import Sidebar from "@/components/Sidebar";

type PrototypeItem = {
  id: string;
  kind: "task" | "blocker" | "risk" | "waiting";
  waiting: boolean;
};

const initialItems: PrototypeItem[] = [
  { id: "ACM-101", kind: "task", waiting: false },
  { id: "ACM-102", kind: "waiting", waiting: true },
  { id: "ACM-103", kind: "risk", waiting: false },
  { id: "ACM-104", kind: "blocker", waiting: false },
];

const initialTranscript = `Client would like the Q3 operating review in final form by next Thursday.

Maya will send the updated churn workbook after finance closes the month.

We still need confirmation from the client PM on rollout sequencing for the pilot markets.

There is a risk that legal review slips if procurement redlines are not resolved this week.
`;

export default function Home() {
  const [items] = useState<PrototypeItem[]>(initialItems);
  const [selectedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<SourceTab>("Transcript");
  const [sourceText, setSourceText] = useState(initialTranscript);
  const [isParsing, setIsParsing] = useState(false);

  const handleParse = () => {
    setIsParsing(true);
    window.setTimeout(() => setIsParsing(false), 1200);
  };

  return (
    <main className="h-screen overflow-hidden bg-bg p-3 text-fg">
      <div className="grid h-full grid-cols-[232px_1fr] overflow-hidden rounded-shell border border-line bg-bg">
        <Sidebar items={items} />

        <section className="grid min-w-0 min-h-0 grid-rows-[44px_1fr]">
          <div className="flex items-center gap-3 border-b border-line px-4">
            <div className="flex items-center gap-2 text-sm text-fg-dim">
              <span>Acme Corp</span>
              <span className="text-fg-faint">/</span>
              <span className="text-fg">Q3 operating review</span>
            </div>
            <div className="ml-auto flex items-center rounded-md border border-line bg-bg-1 p-1 text-xs text-fg-dim">
              <span className="rounded px-2 py-1 text-fg">Board</span>
              <span className="px-2 py-1">List</span>
              <span className="px-2 py-1">Timeline</span>
            </div>
          </div>

          <div className="grid min-h-0 min-w-0 grid-cols-[360px_1fr_300px] gap-4 p-4">
            <div className="min-h-0">
              <InputPanel
                value={sourceText}
                onChange={setSourceText}
                onParse={handleParse}
                isParsing={isParsing}
                activeTab={activeTab}
                onTabChange={setActiveTab}
                attn
              />
            </div>

            <div className="panel flex min-h-0 flex-col overflow-hidden">
              <div className="flex items-center justify-between border-b border-line px-5 py-4">
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-fg-faint">
                    Workspace
                  </div>
                  <h2 className="mt-1 text-base font-semibold text-fg">
                    Board placeholder
                  </h2>
                </div>
                <div className="mono rounded-full border border-line bg-bg-2 px-2.5 py-1 text-[11px] text-fg-dim">
                  {items.length} items
                </div>
              </div>
              <div className="grid min-h-0 flex-1 grid-cols-3 gap-3 p-4">
                {["Todo", "In progress", "Waiting"].map((column) => (
                  <div
                    key={column}
                    className="flex min-h-0 flex-col rounded-[8px] border border-line bg-bg-1 p-3"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-sm font-semibold text-fg">{column}</span>
                      <span className="text-xs text-fg-mute">
                        {column === "Todo" ? 2 : 1}
                      </span>
                    </div>
                    <div className="space-y-3">
                      {[0, 1].map((index) => (
                        <div
                          key={`${column}-${index}`}
                          className="animate-cardIn rounded-[8px] border border-line bg-bg-2 p-3"
                        >
                          <div className="mono text-[11px] text-fg-faint">
                            {items[index]?.id ?? "ACM-000"}
                          </div>
                          <div className="mt-2 text-sm font-medium text-fg">
                            Structured board cards will render here next.
                          </div>
                          <div className="mt-3 flex items-center gap-2 text-xs text-fg-dim">
                            <span className="rounded-full bg-accent-weak px-2 py-1 text-accent">
                              prototype
                            </span>
                            <span>{selectedId ? "selected" : "preview"}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="panel flex min-h-0 flex-col overflow-hidden">
              <div className="border-b border-line px-5 py-4">
                <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-fg-faint">
                  Summary
                </div>
                <h2 className="mt-1 text-base font-semibold text-fg">
                  Right panel placeholder
                </h2>
              </div>
              <div className="space-y-4 overflow-y-auto p-4">
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Action items", value: "08" },
                    { label: "Waiting", value: "02" },
                    { label: "Blockers", value: "01" },
                    { label: "Risks", value: "01" },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="rounded-[8px] border border-line bg-bg-2 p-3"
                    >
                      <div className="text-[11px] uppercase tracking-[0.12em] text-fg-faint">
                        {stat.label}
                      </div>
                      <div className="mt-2 text-2xl font-semibold text-fg">
                        {stat.value}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="rounded-[8px] border border-line bg-bg-2 p-4">
                  <div className="text-sm font-semibold text-fg">
                    Prototype notes
                  </div>
                  <p className="mt-3 text-sm leading-6 text-fg-dim">
                    This prototype now shows the source panel, app shell, sidebar,
                    and workspace layout. The AI extraction board and detailed
                    right panel are still waiting on the schema-driven tasks.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
