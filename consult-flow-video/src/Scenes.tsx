import { useCurrentFrame, interpolate, spring, AbsoluteFill } from "remotion";
import React from "react";

const COLORS = {
  bg: "#0b0c0f",
  "bg-1": "#0f1115",
  "bg-2": "#14171d",
  "bg-3": "#1a1e26",
  line: "#23262f",
  "line-2": "#2a2e38",
  fg: "#e7e9ee",
  "fg-dim": "#a2a7b3",
  "fg-mute": "#6b7280",
  "fg-faint": "#4b5160",
  accent: "#7c7aff",
  "accent-weak": "#2a2a6a",
  accentGlow: "rgba(124, 122, 255, 0.18)",
  warn: "#f5a524",
  danger: "#ef4444",
  ok: "#22c55e",
  info: "#38bdf8",
};

const TRANSCRIPT_SAMPLE = `Sarah: Hey team, following up on our call. A few things:

Legal has flagged the vendor contract renewal — we need sign-off from procurement before we can proceed. Targeting end of next week but this is at risk.

Marcus: Thanks for the update. Can someone own the competitive benchmarking deck? We promised the board a first draft by May 2.

Sarah: I'm waiting on Marcus to confirm the go-live date for the APAC rollout. He was supposed to revert by yesterday.`;

const SAMPLE_CARDS = [
  { id: "ACM-101", title: "Competitive benchmarking deck", kind: "task", status: "todo", owner: "JS", ownerName: "John Smith" },
  { id: "ACM-102", title: "Vendor contract sign-off", kind: "blocker", status: "todo", owner: "Legal", ownerName: "Legal team" },
  { id: "ACM-103", title: "Go-live date confirmation", kind: "waiting", status: "waiting", owner: "MC", ownerName: "Marcus Chen" },
  { id: "ACM-104", title: "Pricing model rework", kind: "risk", status: "doing", owner: "JS", ownerName: "John Smith", due: "May 5" },
];

const SUMMARY_TEXT = `Executive Summary

As of Q3 2026, ACM Corp engagement is progressing with 4 active commitments, 2 blockers requiring escalation, and 1 identified risk to timeline.

Client-gating items: Vendor contract renewal pending procurement sign-off (at risk for May 15 deadline). Go-live date confirmation overdue from Marcus Chen.

Next Steps: Escalate vendor contract to procurement lead. Follow up on APAC go-live date. Complete competitive benchmarking deck for board presentation.`;

const sceneDuration = (start: number, end: number) => ({
  inStart: start,
  inEnd: end,
  duration: end - start
});

export const SCENES = {
  hook: sceneDuration(0, 300),
  problem: sceneDuration(300, 750),
  solution: sceneDuration(750, 1200),
  source: sceneDuration(1200, 1650),
  board: sceneDuration(1650, 2250),
  summary: sceneDuration(2250, 2850),
  actions: sceneDuration(2850, 3300),
  closing: sceneDuration(3300, 3600),
};

export const totalFrames = 3600;

export const Scene1_Hook = () => {
  const f = useCurrentFrame();
  const o = interpolate(f, [0, 30, 240, 300], [0, 1, 1, 0], { extrapolateClamp: true });
  const s = interpolate(f, [0, 60], [0.9, 1], { extrapolateClamp: true });
  
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, justifyContent: "center", alignItems: "center" }}>
      <div style={{ textAlign: "center", opacity: o, transform: `scale(${s})`, transformOrigin: "center" }}>
        <div style={{ fontSize: 72, fontWeight: 700, color: COLORS.fg, letterSpacing: "-0.02em" }}>ConsultFlow</div>
        <div style={{ fontSize: 28, color: COLORS["fg-dim"], marginTop: 20 }}>AI Consulting Workflow Automation</div>
      </div>
    </AbsoluteFill>
  );
};

export const Scene2_Problem = () => {
  const f = useCurrentFrame();
  const t1 = interpolate(f, [30, 90], [0, 1], { extrapolateClamp: true });
  const t2 = interpolate(f, [90, 150], [0, 1], { extrapolateClamp: true });
  const t3 = interpolate(f, [150, 210], [0, 1], { extrapolateClamp: true });
  const t4 = interpolate(f, [210, 270], [0, 1], { extrapolateClamp: true });
  const fo = interpolate(f, [420, 450], [1, 0], { extrapolateClamp: true });
  
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, padding: 80, opacity: fo }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
        <div style={{ fontSize: 28, color: COLORS["fg-dim"], opacity: t1 }}>Every consultant's nightmare:</div>
        <div style={{ fontSize: 52, fontWeight: 600, color: COLORS.fg, opacity: t2 }}>"20+ client emails to parse"</div>
        <div style={{ fontSize: 52, fontWeight: 600, color: COLORS.danger, opacity: t3 }}>"Lost commitments = Lost trust"</div>
        <div style={{ fontSize: 52, fontWeight: 600, color: COLORS["fg-mute"], opacity: t4 }}>"Manual tracking = No time for actual work"</div>
      </div>
    </AbsoluteFill>
  );
};

export const Scene3_SolutionIntro = () => {
  const f = useCurrentFrame();
  const meet = interpolate(f, [30, 90], [0, 1], { extrapolateClamp: true });
  const title = interpolate(f, [90, 150], [0, 1], { extrapolateClamp: true });
  const sub = interpolate(f, [150, 210], [0, 1], { extrapolateClamp: true });
  const fo = interpolate(f, [420, 450], [1, 0], { extrapolateClamp: true });
  
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, justifyContent: "center", alignItems: "center", opacity: fo }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 28, color: COLORS["fg-mute"], opacity: meet }}>
          Meet
        </div>
        <div style={{ fontSize: 84, fontWeight: 700, color: COLORS.accent, letterSpacing: "-0.02em", opacity: title, textShadow: `0 0 80px ${COLORS.accentGlow}` }}>
          ConsultFlow
        </div>
        <div style={{ fontSize: 28, color: COLORS["fg-dim"], marginTop: 20, opacity: sub }}>
          AI-powered consulting workflow automation
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const Scene4_SourceIngestion = () => {
  const f = useCurrentFrame();
  const panel = interpolate(f, [30, 90], [0, 1], { extrapolateClamp: true });
  const tabs = interpolate(f, [60, 120], [0, 1], { extrapolateClamp: true });
  const content = interpolate(f, [90, 150], [0, 1], { extrapolateClamp: true });
  const button = interpolate(f, [150, 210], [0, 1], { extrapolateClamp: true });
  const loading = interpolate(f, [210, 330], [0, 1], { extrapolateClamp: true });
  const fo = interpolate(f, [420, 450], [1, 0], { extrapolateClamp: true });
  
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, opacity: fo }}>
      <div style={{ width: "33%", height: "100%", backgroundColor: COLORS["bg-1"], borderRight: `1px solid ${COLORS.line}`, padding: 20, opacity: panel }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: COLORS.fg, marginBottom: 12 }}>
          Source
        </div>
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          {["Transcript", "Email", "Notes"].map((tab, i) => (
            <div key={tab} style={{ padding: "8px 14px", borderRadius: 6, fontSize: 12, color: i === 0 ? COLORS.fg : COLORS["fg-dim"], backgroundColor: i === 0 ? COLORS["bg-3"] : "transparent", border: i === 0 ? `1px solid ${COLORS["line-2"]}` : `1px solid ${COLORS.line}` }}>
              {tab}
            </div>
          ))}
        </div>
        <div style={{ backgroundColor: COLORS["bg-2"], borderRadius: 8, padding: 16, height: 300, fontSize: 11, color: COLORS["fg-dim"], fontFamily: "monospace", opacity: content, lineHeight: 1.5 }}>
          {TRANSCRIPT_SAMPLE}
        </div>
        <div style={{ display: "flex", gap: 12, marginTop: 16, opacity: button }}>
          <div style={{ padding: "10px 20px", borderRadius: 6, fontSize: 12, color: COLORS["fg-dim"], border: `1px solid ${COLORS.line}` }}>Clear</div>
          <div style={{ padding: "10px 20px", borderRadius: 6, fontSize: 12, color: "#fff", backgroundColor: COLORS.accent, fontWeight: 500 }}>Re-parse</div>
        </div>
      </div>
      <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", opacity: loading }}>
        <div style={{ backgroundColor: COLORS["bg-2"], borderRadius: 12, padding: "24px 32px", border: `1px solid ${COLORS.line}`, minWidth: 340 }}>
          {[
            { text: "Segmenting by speaker", done: true },
            { text: "Identifying commitments & owners", done: true },
            { text: "Classifying blockers, risks, waiting", done: true },
            { text: "Linking to source quotes", done: false },
          ].map((step, i) => (
            <div key={step.text} style={{ display: "flex", alignItems: "center", gap: 14, padding: "10px 0", color: step.done ? COLORS.ok : i === 3 ? COLORS.fg : COLORS["fg-dim"], fontSize: 14 }}>
              <div style={{ width: 22, height: 22, borderRadius: "50%", backgroundColor: step.done ? COLORS.ok : "transparent", border: `1px solid ${step.done ? COLORS.ok : COLORS.line}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "#fff" }}>
                {step.done ? "✓" : ""}
              </div>
              {step.text}
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const Scene5_Kanban = () => {
  const f = useCurrentFrame();
  const col1 = interpolate(f, [30, 90], [0, 1], { extrapolateClamp: true });
  const col2 = interpolate(f, [90, 150], [0, 1], { extrapolateClamp: true });
  const col3 = interpolate(f, [150, 210], [0, 1], { extrapolateClamp: true });
  const col4 = interpolate(f, [210, 270], [0, 1], { extrapolateClamp: true });
  const fo = interpolate(f, [570, 600], [1, 0], { extrapolateClamp: true });
  
  const columns = [
    { key: "todo", label: "Todo", color: COLORS["fg-dim"], count: 2, status: "todo" as const },
    { key: "doing", label: "In progress", color: COLORS.info, count: 1, status: "doing" as const },
    { key: "waiting", label: "Waiting on client", color: COLORS.warn, count: 1, status: "waiting" as const },
    { key: "done", label: "Done", color: COLORS.ok, count: 0, status: "done" as const },
  ];
  
  const cardEntry = (delay: number) => interpolate(f, [delay, delay + 30], [0, 1], { extrapolateClamp: true });
  
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, padding: 32, opacity: fo }}>
      <div style={{ display: "flex", gap: 16, height: "100%" }}>
        {columns.map((col, colIdx) => {
          const cards = SAMPLE_CARDS.filter(c => c.status === col.status);
          const op = [col1, col2, col3, col4][colIdx];
          return (
            <div key={col.key} style={{ flex: 1, backgroundColor: COLORS["bg-1"], borderRadius: 12, border: `1px solid ${COLORS.line}`, overflow: "hidden", opacity: op }}>
              <div style={{ padding: "14px 18px", borderBottom: `1px solid ${COLORS.line}`, display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: col.color }} />
                <span style={{ fontSize: 13, fontWeight: 500, color: COLORS.fg }}>{col.label}</span>
                <span style={{ fontSize: 12, color: COLORS["fg-mute"] }}>{col.count}</span>
              </div>
              <div style={{ padding: 14, display: "flex", flexDirection: "column", gap: 10 }}>
                {cards.map((card, i) => {
                  const cardOp = interpolate(f, [60 + colIdx * 40 + i * 30, 60 + colIdx * 40 + i * 30 + 30], [0, 1], { extrapolateClamp: true });
                  const cardY = interpolate(f, [60 + colIdx * 40 + i * 30, 60 + colIdx * 40 + i * 30 + 30], [20, 0], { extrapolateClamp: true });
                  const kindColors: Record<string, string> = { task: COLORS.accent, blocker: COLORS.danger, risk: COLORS.warn, waiting: COLORS.info };
                  return (
                    <div key={card.id} style={{ backgroundColor: COLORS["bg-2"], borderRadius: 8, padding: 14, border: `1px solid ${COLORS.line}`, opacity: cardOp, transform: `translateY(${cardY}px)` }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                        <span style={{ fontSize: 10, color: COLORS["fg-mute"], fontFamily: "monospace" }}>{card.id}</span>
                        <span style={{ fontSize: 9, padding: "3px 8px", borderRadius: 4, backgroundColor: kindColors[card.kind] + "25", color: kindColors[card.kind], fontWeight: 500 }}>{card.kind}</span>
                      </div>
                      <div style={{ fontSize: 12, color: COLORS.fg, marginBottom: 10, lineHeight: 1.4 }}>{card.title}</div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ width: 22, height: 22, borderRadius: "50%", backgroundColor: COLORS.accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 600, color: "#fff" }}>{card.owner}</div>
                        <span style={{ fontSize: 11, color: COLORS["fg-dim"] }}>{card.ownerName}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

export const Scene6_Summary = () => {
  const f = useCurrentFrame();
  const panel = interpolate(f, [30, 90], [0, 1], { extrapolateClamp: true });
  const stats = interpolate(f, [90, 150], [0, 1], { extrapolateClamp: true });
  const bar = interpolate(f, [150, 210], [0, 1], { extrapolateClamp: true });
  const content = interpolate(f, [210, 270], [0, 1], { extrapolateClamp: true });
  const button = interpolate(f, [270, 330], [0, 1], { extrapolateClamp: true });
  const fo = interpolate(f, [570, 600], [1, 0], { extrapolateClamp: true });
  
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, opacity: fo }}>
      <div style={{ flex: 1 }} />
      <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 320, backgroundColor: COLORS["bg-1"], borderLeft: `1px solid ${COLORS.line}`, padding: 24, opacity: panel }}>
        <div style={{ fontSize: 18, fontWeight: 600, color: COLORS.fg, marginBottom: 20 }}>
          Executive Summary
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20, opacity: stats }}>
          {[
            { label: "Action items", value: "4", color: COLORS.accent },
            { label: "Waiting", value: "2", color: COLORS.warn },
            { label: "Blockers", value: "2", color: COLORS.danger },
            { label: "Risks", value: "1", color: COLORS.info },
          ].map(stat => (
            <div key={stat.label} style={{ backgroundColor: COLORS["bg-2"], borderRadius: 10, padding: 14, textAlign: "center" }}>
              <div style={{ fontSize: 24, fontWeight: 600, color: stat.color }}>{stat.value}</div>
              <div style={{ fontSize: 11, color: COLORS["fg-mute"], marginTop: 4 }}>{stat.label}</div>
            </div>
          ))}
        </div>
        <div style={{ height: 8, backgroundColor: COLORS["bg-3"], borderRadius: 4, overflow: "hidden", marginBottom: 20, opacity: bar }}>
          <div style={{ width: "40%", height: "100%", backgroundColor: COLORS.ok, float: "left" }} />
          <div style={{ width: "25%", height: "100%", backgroundColor: COLORS.info, float: "left" }} />
          <div style={{ width: "20%", height: "100%", backgroundColor: COLORS.warn, float: "left" }} />
          <div style={{ width: "15%", height: "100%", backgroundColor: COLORS["fg-mute"], float: "left" }} />
        </div>
        <div style={{ backgroundColor: COLORS["bg-2"], borderRadius: 10, padding: 16, fontSize: 11, color: COLORS["fg-dim"], lineHeight: 1.6, opacity: content }}>
          {SUMMARY_TEXT}
        </div>
        <div style={{ marginTop: 24, padding: "12px 20px", borderRadius: 8, fontSize: 13, fontWeight: 500, color: "#fff", backgroundColor: COLORS.accent, textAlign: "center", opacity: button }}>Generate digest</div>
      </div>
    </AbsoluteFill>
  );
};

export const Scene7_AutoActions = () => {
  const f = useCurrentFrame();
  const panel = interpolate(f, [30, 90], [0, 1], { extrapolateClamp: true });
  const header = interpolate(f, [90, 150], [0, 1], { extrapolateClamp: true });
  const status = interpolate(f, [150, 210], [0, 1], { extrapolateClamp: true });
  const actions = interpolate(f, [210, 270], [0, 1], { extrapolateClamp: true });
  const result = interpolate(f, [270, 330], [0, 1], { extrapolateClamp: true });
  const fo = interpolate(f, [420, 450], [1, 0], { extrapolateClamp: true });
  
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, opacity: fo }}>
      <div style={{ flex: 1 }} />
      <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 320, backgroundColor: COLORS["bg-1"], borderLeft: `1px solid ${COLORS.line}`, padding: 24, opacity: panel }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, opacity: header }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: COLORS.fg }}>
          ACM-102
        </div>
          <span style={{ fontSize: 10, padding: "4px 10px", borderRadius: 4, backgroundColor: COLORS.danger + "25", color: COLORS.danger, fontWeight: 500 }}>blocker</span>
        </div>
        <div style={{ fontSize: 18, fontWeight: 500, color: COLORS.fg, marginBottom: 20 }}>
          Vendor contract sign-off
        </div>
        <div style={{ display: "flex", gap: 6, padding: 6, backgroundColor: COLORS["bg-2"], borderRadius: 10, marginBottom: 20, opacity: status }}>
          {["Todo", "In progress", "Waiting", "Done"].map((s, i) => (
            <div key={s} style={{ flex: 1, padding: "8px 6px", borderRadius: 8, fontSize: 10, textAlign: "center", color: i === 1 ? COLORS.fg : COLORS["fg-dim"], backgroundColor: i === 1 ? COLORS["bg-3"] : "transparent", border: i === 1 ? `1px solid ${COLORS["line-2"]}` : "transparent" }}>{s}</div>
          ))}
        </div>
        <div style={{ fontSize: 13, fontWeight: 500, color: COLORS.fg, marginBottom: 14, opacity: actions }}>
          Automated actions
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, opacity: actions }}>
          <div style={{ padding: "14px 16px", borderRadius: 10, fontSize: 12, color: COLORS["fg-dim"], border: `1px solid ${COLORS.line}`, backgroundColor: COLORS["bg-2"] }}>Write escalation note</div>
          <div style={{ padding: "14px 16px", borderRadius: 10, fontSize: 12, color: COLORS["fg-dim"], border: `1px solid ${COLORS.line}`, backgroundColor: COLORS["bg-2"] }}>Draft memo to legal</div>
        </div>
        <div style={{ marginTop: 20, padding: 16, borderRadius: 10, border: `1px solid ${COLORS.line}`, backgroundColor: COLORS["bg-1"], opacity: result }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
            <span style={{ fontSize: 10, color: COLORS.accent, fontWeight: 500 }}>escalation_note</span>
            <span style={{ fontSize: 10, color: COLORS["fg-mute"] }}>Copy</span>
          </div>
          <div style={{ fontSize: 11, color: COLORS["fg-dim"], fontFamily: "monospace", lineHeight: 1.5 }}>
            To: Sarah Chen, VP Operations<br />
            Re: Vendor contract renewal at risk<br /><br />
            The vendor contract renewal is at risk due to delayed procurement sign-off...
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const Scene8_Closing = () => {
  const f = useCurrentFrame();
  const sub = interpolate(f, [30, 90], [0, 1], { extrapolateClamp: true });
  const title = interpolate(f, [90, 150], [0, 1], { extrapolateClamp: true });
  const cta = interpolate(f, [150, 210], [0, 1], { extrapolateClamp: true });
  const fade = interpolate(f, [270, 300], [1, 0], { extrapolateClamp: true });
  
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, justifyContent: "center", alignItems: "center", opacity: fade }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 28, color: COLORS["fg-mute"], opacity: sub }}>
          From chaos to clarity
        </div>
        <div style={{ fontSize: 72, fontWeight: 700, color: COLORS.fg, letterSpacing: "-0.02em", marginTop: 20, opacity: title }}>
          ConsultFlow
        </div>
        <div style={{ fontSize: 52, fontWeight: 700, color: COLORS.accent, marginTop: 28, opacity: cta }}>
          Stop tracking.
        </div>
        <div style={{ fontSize: 52, fontWeight: 700, color: COLORS.accent, opacity: cta }}>
          Start consulting.
        </div>
      </div>
    </AbsoluteFill>
  );
};