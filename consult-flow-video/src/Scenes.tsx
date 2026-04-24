import { useCurrentFrame, interpolate, spring, AbsoluteFill, random } from "remotion";
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
  { id: "ACM-104", title: "Pricing model rework", kind: "risk", status: "doing", owner: "JS", ownerName: "John Smith" },
];

const SUMMARY_TEXT = `Executive Summary
As of Q3 2026, ACM Corp engagement is progressing with 4 active commitments, 2 blockers requiring escalation, and 1 identified risk to timeline.`;

function easeInOut(t: number) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

function MouseCursor({ x, y, delay = 0 }: { x: number; y: number; delay?: number }) {
  const f = useCurrentFrame();
  const progress = Math.max(0, (f - delay) / 15);
  const eased = easeInOut(Math.min(1, progress));
  const curX = interpolate(eased, [0, 1], [1600, x], { extrapolateClamp: true });
  const curY = interpolate(eased, [0, 1], [800, y], { extrapolateClamp: true });
  
  return (
    <div style={{
      position: "absolute",
      left: curX,
      top: curY,
      width: 20,
      height: 28,
      borderRadius: "10px 10px 4px 4px",
      background: COLORS.fg,
      pointerEvents: "none",
      zIndex: 9999,
      boxShadow: `0 0 10px rgba(255,255,255,0.3)`,
    }}>
      <div style={{
        position: "absolute",
        left: 8,
        top: 10,
        width: 6,
        height: 6,
        background: COLORS.bg,
        borderRadius: "50%",
      }} />
    </div>
  );
}

function ClickEffect({ x, y, delay = 0 }: { x: number; y: number; delay?: number }) {
  const f = useCurrentFrame() - delay;
  const scale = interpolate(f, [0, 10], [0.5, 1.5], { extrapolateClamp: true });
  const opacity = interpolate(f, [0, 10], [0.8, 0], { extrapolateClamp: true });
  
  if (f < 0 || f > 15) return null;
  
  return (
    <div style={{
      position: "absolute",
      left: x - 10,
      top: y - 10,
      width: 20,
      height: 20,
      borderRadius: "50%",
      border: `2px solid ${COLORS.accent}`,
      transform: `scale(${scale})`,
      opacity,
      pointerEvents: "none",
      zIndex: 9998,
    }} />
  );
}

export const sceneDuration = (start: number, end: number) => ({
  inStart: start,
  inEnd: end,
  duration: end - start
});

export const SCENES = {
  hook: sceneDuration(0, 180),
  problem: sceneDuration(180, 360),
  solution: sceneDuration(360, 540),
  source: sceneDuration(540, 840),
  board: sceneDuration(840, 1260),
  summary: sceneDuration(1260, 1560),
  actions: sceneDuration(1560, 1860),
  closing: sceneDuration(1860, 2100),
};

export const totalFrames = 2100;

function AnimatedCard({ card, delay, clickDelay }: { card: typeof SAMPLE_CARDS[0]; delay: number; clickDelay: number }) {
  const frame = useCurrentFrame();
  const cardOpacity = interpolate(frame, [delay, delay + 20], [0, 1], { extrapolateClamp: true });
  const cardY = interpolate(frame, [delay, delay + 30], [30, 0], { extrapolateClamp: true });
  const isHovered = frame > clickDelay && frame < clickDelay + 60;
  const hoverScale = isHovered ? interpolate(frame, [clickDelay, clickDelay + 10], [1, 1.02], { extrapolateClamp: true }) : 1;
  
  const kindColors: Record<string, string> = {
    task: COLORS.accent,
    blocker: COLORS.danger,
    risk: COLORS.warn,
    waiting: COLORS.info,
  };
  
  return (
    <div style={{
      backgroundColor: COLORS["bg-2"],
      borderRadius: 8,
      padding: 12,
      border: isHovered ? `1px solid ${COLORS.accent}` : `1px solid ${COLORS.line}`,
      opacity: cardOpacity,
      transform: `translateY(${cardY}px) scale(${hoverScale})`,
      transition: "transform 0.1s",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
        <span style={{ fontSize: 10, color: COLORS["fg-mute"], fontFamily: "monospace" }}>{card.id}</span>
        <span style={{ fontSize: 9, padding: "2px 6px", borderRadius: 4, backgroundColor: kindColors[card.kind] + "25", color: kindColors[card.kind] }}>
          {card.kind}
        </span>
      </div>
      <div style={{ fontSize: 11, color: COLORS.fg, marginBottom: 8 }}>{card.title}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <div style={{ width: 18, height: 18, borderRadius: "50%", backgroundColor: COLORS.accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, fontWeight: 600, color: COLORS.bg }}>
          {card.owner}
        </div>
        <span style={{ fontSize: 10, color: COLORS["fg-dim"] }}>{card.ownerName}</span>
      </div>
    </div>
  );
}

export const Scene1_Hook = () => {
  const f = useCurrentFrame();
  const o = interpolate(f, [0, 30, 150, 180], [0, 1, 1, 0], { extrapolateClamp: true });
  const s = interpolate(f, [0, 60], [0.9, 1], { extrapolateClamp: true });
  
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
        <div style={{ textAlign: "center", opacity: o, transform: `scale(${s})`, transformOrigin: "center" }}>
          <div style={{ fontSize: 72, fontWeight: 700, color: COLORS.fg, letterSpacing: "-0.02em" }}>ConsultFlow</div>
          <div style={{ fontSize: 28, color: COLORS["fg-dim"], marginTop: 20 }}>AI Consulting Workflow Automation</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const Scene2_Problem = () => {
  const f = useCurrentFrame() - 180;
  const t1 = interpolate(f, [20, 60], [0, 1], { extrapolateClamp: true });
  const t2 = interpolate(f, [60, 100], [0, 1], { extrapolateClamp: true });
  const t3 = interpolate(f, [100, 140], [0, 1], { extrapolateClamp: true });
  const fade = interpolate(f, [160, 180], [1, 0], { extrapolateClamp: true });
  
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, padding: 80, opacity: fade }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
        <div style={{ fontSize: 28, color: COLORS["fg-dim"], opacity: t1 }}>Every consultant's nightmare:</div>
        <div style={{ fontSize: 48, fontWeight: 600, color: COLORS.fg, opacity: t2 }}>"20+ client emails"</div>
        <div style={{ fontSize: 48, fontWeight: 600, color: COLORS.danger, opacity: t3 }}>"Lost commitments"</div>
      </div>
    </AbsoluteFill>
  );
};

export const Scene3_SolutionIntro = () => {
  const f = useCurrentFrame() - 360;
  const meet = interpolate(f, [20, 60], [0, 1], { extrapolateClamp: true });
  const title = interpolate(f, [60, 100], [0, 1], { extrapolateClamp: true });
  const sub = interpolate(f, [100, 140], [0, 1], { extrapolateClamp: true });
  const fade = interpolate(f, [160, 180], [1, 0], { extrapolateClamp: true });
  
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, opacity: fade }}>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 24, color: COLORS["fg-mute"], opacity: meet }}>Meet</div>
          <div style={{ fontSize: 80, fontWeight: 700, color: COLORS.accent, letterSpacing: "-0.02em", opacity: title, textShadow: `0 0 60px ${COLORS.accentGlow}` }}>ConsultFlow</div>
          <div style={{ fontSize: 24, color: COLORS["fg-dim"], marginTop: 16, opacity: sub }}>AI Consulting Workflow</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const Scene4_SourceIngestion = () => {
  const f = useCurrentFrame() - 540;
  
  const panel = interpolate(f, [20, 60], [0, 1], { extrapolateClamp: true });
  const showTranscript = interpolate(f, [40, 80], [0, 1], { extrapolateClamp: true });
  const showContent = interpolate(f, [80, 120], [0, 1], { extrapolateClamp: true });
  const moveToButton = interpolate(f, [150, 170], [0, 1], { extrapolateClamp: true });
  const clickEffect = interpolate(f, [170, 185], [0, 1], { extrapolateClamp: true });
  const showLoading = interpolate(f, [190, 220], [0, 1], { extrapolateClamp: true });
  const fade = interpolate(f, [280, 300], [1, 0], { extrapolateClamp: true });
  
  const buttonX = 360 - 180 + 180 - 120;
  const buttonY = 1080 - 400;
  
  const btnX = interpolate(moveToButton, [0, 1], [360, 180], { extrapolateClamp: true });
  const btnY = interpolate(moveToButton, [0, 1], [600, buttonY], { extrapolateClamp: true });
  
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, opacity: fade }}>
      <div style={{ width: 360, height: "100%", backgroundColor: COLORS["bg-1"], borderRight: `1px solid ${COLORS.line}`, padding: 20, opacity: panel }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: COLORS.fg, marginBottom: 16 }}>Source</div>
        
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          {["Transcript", "Email", "Notes"].map((tab, i) => (
            <div key={tab} style={{ padding: "8px 14px", borderRadius: 6, fontSize: 12, color: i === 0 ? COLORS.fg : COLORS["fg-dim"], backgroundColor: i === 0 ? COLORS["bg-3"] : "transparent", border: i === 0 ? `1px solid ${COLORS["line-2"]}` : `1px solid ${COLORS.line}` }}>
              {tab}
            </div>
          ))}
        </div>
        
        <div style={{ backgroundColor: COLORS["bg-2"], borderRadius: 8, padding: 14, height: 280, fontSize: 10, color: COLORS["fg-dim"], fontFamily: "monospace", opacity: showContent, lineHeight: 1.6 }}>
          {TRANSCRIPT_SAMPLE.split("\n").slice(0, 8).join("\n")}
        </div>
        
        <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
          <div style={{ padding: "10px 18px", borderRadius: 6, fontSize: 12, color: COLORS["fg-dim"], border: `1px solid ${COLORS.line}` }}>Clear</div>
          <div style={{ padding: "10px 18px", borderRadius: 6, fontSize: 12, color: COLORS.bg, backgroundColor: COLORS.accent }}>Re-parse</div>
        </div>
      </div>
      
      {showLoading > 0 && (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", opacity: showLoading }}>
          <div style={{ backgroundColor: COLORS["bg-2"], borderRadius: 12, padding: "20px 28px", border: `1px solid ${COLORS.line}` }}>
            {[
              { text: "Segmenting by speaker", done: true },
              { text: "Identifying commitments", done: true },
              { text: "Classifying blockers", done: true },
              { text: "Linking to quotes", done: false },
            ].map((step, i) => (
              <div key={step.text} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", color: step.done ? COLORS.ok : i === 3 ? COLORS.fg : COLORS["fg-dim"], fontSize: 12 }}>
                <div style={{ width: 18, height: 18, borderRadius: "50%", backgroundColor: step.done ? COLORS.ok : "transparent", border: `1px solid ${step.done ? COLORS.ok : COLORS.line}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "#fff" }}>
                  {step.done ? "✓" : ""}
                </div>
                {step.text}
              </div>
            ))}
          </div>
        </div>
      )}
      
      <MouseCursor x={btnX} y={btnY} delay={150} />
      {clickEffect > 0 && <ClickEffect x={btnX} y={btnY} delay={170} />}
    </AbsoluteFill>
  );
};

export const Scene5_Kanban = () => {
  const f = useCurrentFrame() - 840;
  
  const fadeIn = interpolate(f, [0, 30], [0, 1], { extrapolateClamp: true });
  const col1 = interpolate(f, [20, 60], [0, 1], { extrapolateClamp: true });
  const col2 = interpolate(f, [40, 80], [0, 1], { extrapolateClamp: true });
  const col3 = interpolate(f, [60, 100], [0, 1], { extrapolateClamp: true });
  const col4 = interpolate(f, [80, 120], [0, 1], { extrapolateClamp: true });
  
  const moveToCard = interpolate(f, [150, 180], [0, 1], { extrapolateClamp: true });
  const showClick = interpolate(f, [200, 220], [0, 1], { extrapolateClamp: true });
  
  const cursorX = interpolate(moveToCard, [0, 1], [300, 500], { extrapolateClamp: true });
  const cursorY = interpolate(moveToCard, [0, 1], [400, 380], { extrapolateClamp: true });
  
  const columns = [
    { key: "todo", label: "Todo", color: COLORS["fg-dim"], count: 2, opacity: col1 },
    { key: "doing", label: "In Progress", color: COLORS.info, count: 1, opacity: col2 },
    { key: "waiting", label: "Waiting", color: COLORS.warn, count: 1, opacity: col3 },
    { key: "done", label: "Done", color: COLORS.ok, count: 0, opacity: col4 },
  ];
  
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, padding: 24, opacity: fadeIn }}>
      <div style={{ display: "flex", gap: 12, height: "100%" }}>
        {columns.map((col, colIdx) => (
          <div key={col.key} style={{ flex: 1, backgroundColor: COLORS["bg-1"], borderRadius: 12, border: `1px solid ${COLORS.line}`, overflow: "hidden", opacity: col.opacity }}>
            <div style={{ padding: "12px 16px", borderBottom: `1px solid ${COLORS.line}`, display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: col.color }} />
              <span style={{ fontSize: 12, fontWeight: 500, color: COLORS.fg }}>{col.label}</span>
              <span style={{ fontSize: 11, color: COLORS["fg-mute"] }}>{col.count}</span>
            </div>
            <div style={{ padding: 12, display: "flex", flexDirection: "column", gap: 8 }}>
              {SAMPLE_CARDS.filter(c => c.status === col.key).map((card, i) => (
                <AnimatedCard key={card.id} card={card} delay={60 + colIdx * 20 + i * 20} clickDelay={150} />
              ))}
            </div>
          </div>
        ))}
      </div>
      
      <MouseCursor x={cursorX} y={cursorY} delay={150} />
      {showClick > 0 && <ClickEffect x={cursorX} y={cursorY} delay={200} />}
    </AbsoluteFill>
  );
};

export const Scene6_Summary = () => {
  const f = useCurrentFrame() - 1260;
  
  const panel = interpolate(f, [20, 60], [0, 1], { extrapolateClamp: true });
  const stats = interpolate(f, [60, 100], [0, 1], { extrapolateClamp: true });
  const content = interpolate(f, [100, 140], [0, 1], { extrapolateClamp: true });
  const button = interpolate(f, [160, 200], [0, 1], { extrapolateClamp: true });
  const moveClick = interpolate(f, [200, 220], [0, 1], { extrapolateClamp: true });
  const result = interpolate(f, [240, 280], [0, 1], { extrapolateClamp: true });
  const fade = interpolate(f, [280, 300], [1, 0], { extrapolateClamp: true });
  
  const btnX = 1920 - 320 + 100;
  const btnY = 1080 - 150;
  
  const cursorX = interpolate(moveClick, [0, 1], [1600, btnX], { extrapolateClamp: true });
  const cursorY = interpolate(moveClick, [0, 1], [500, btnY], { extrapolateClamp: true });
  
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, opacity: fade }}>
      <div style={{ flex: 1 }} />
      
      <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 320, backgroundColor: COLORS["bg-1"], borderLeft: `1px solid ${COLORS.line}`, padding: 24, opacity: panel }}>
        <div style={{ fontSize: 16, fontWeight: 600, color: COLORS.fg, marginBottom: 16 }}>Executive Summary</div>
        
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16, opacity: stats }}>
          {[
            { label: "Items", value: "4", color: COLORS.accent },
            { label: "Waiting", value: "2", color: COLORS.warn },
            { label: "Blockers", value: "2", color: COLORS.danger },
            { label: "Risks", value: "1", color: COLORS.info },
          ].map(s => (
            <div key={s.label} style={{ backgroundColor: COLORS["bg-2"], borderRadius: 8, padding: 12, textAlign: "center" }}>
              <div style={{ fontSize: 20, fontWeight: 600, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 10, color: COLORS["fg-mute"] }}>{s.label}</div>
            </div>
          ))}
        </div>
        
        <div style={{ backgroundColor: COLORS["bg-2"], borderRadius: 8, padding: 14, fontSize: 10, color: COLORS["fg-dim"], lineHeight: 1.5, opacity: content }}>
          {SUMMARY_TEXT}
        </div>
        
        <div style={{ marginTop: 100, padding: "12px 18px", borderRadius: 8, fontSize: 12, fontWeight: 500, color: "#fff", backgroundColor: COLORS.accent, textAlign: "center", opacity: button }}>
          Generate digest
        </div>
        
        {result > 0 && (
          <div style={{ marginTop: 16, padding: 14, borderRadius: 8, border: `1px solid ${COLORS.ok}`, backgroundColor: COLORS["bg-2"], opacity: result }}>
            <div style={{ fontSize: 11, color: COLORS.ok, marginBottom: 8 }}>Digest generated ✓</div>
            <div style={{ fontSize: 10, color: COLORS["fg-dim"] }}>
              • ACM-101: Competitive deck ready<br/>
              • ACM-102: Escalation note sent
            </div>
          </div>
        )}
      </div>
      
      <MouseCursor x={cursorX} y={cursorY} delay={200} />
      {moveClick > 0 && <ClickEffect x={btnX} y={btnY} delay={220} />}
    </AbsoluteFill>
  );
};

export const Scene7_AutoActions = () => {
  const f = useCurrentFrame() - 1560;
  
  const panel = interpolate(f, [20, 60], [0, 1], { extrapolateClamp: true });
  const button = interpolate(f, [80, 120], [0, 1], { extrapolateClamp: true });
  const moveClick = interpolate(f, [150, 170], [0, 1], { extrapolateClamp: true });
  const result = interpolate(f, [190, 230], [0, 1], { extrapolateClamp: true });
  const fade = interpolate(f, [280, 300], [1, 0], { extrapolateClamp: true });
  
  const btnX = 1920 - 320 + 80;
  const btnY = 1080 - 200;
  
  const cursorX = interpolate(moveClick, [0, 1], [1600, btnX], { extrapolateClamp: true });
  const cursorY = interpolate(moveClick, [0, 1], [500, btnY], { extrapolateClamp: true });
  
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, opacity: fade }}>
      <div style={{ flex: 1 }} />
      
      <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 320, backgroundColor: COLORS["bg-1"], borderLeft: `1px solid ${COLORS.line}`, padding: 24, opacity: panel }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: COLORS.fg }}>ACM-102</div>
          <div style={{ fontSize: 9, padding: "3px 8px", borderRadius: 4, backgroundColor: COLORS.danger + "25", color: COLORS.danger }}>blocker</div>
        </div>
        
        <div style={{ fontSize: 16, fontWeight: 500, color: COLORS.fg, marginBottom: 16 }}>Vendor contract sign-off</div>
        
        <div style={{ fontSize: 12, fontWeight: 500, color: COLORS.fg, marginBottom: 12 }}>Automated actions</div>
        
        <div style={{ display: "flex", flexDirection: "column", gap: 10, opacity: button }}>
          <div style={{ padding: "12px 16px", borderRadius: 8, fontSize: 12, color: COLORS["fg-dim"], border: `1px solid ${COLORS.line}`, backgroundColor: COLORS["bg-2"] }}>
            Write escalation note
          </div>
          <div style={{ padding: "12px 16px", borderRadius: 8, fontSize: 12, color: COLORS["fg-dim"], border: `1px solid ${COLORS.line}`, backgroundColor: COLORS["bg-2"] }}>
            Draft memo to legal
          </div>
        </div>
        
        {result > 0 && (
          <div style={{ marginTop: 16, padding: 14, borderRadius: 8, border: `1px solid ${COLORS.accent}`, backgroundColor: COLORS["bg-1"] }}>
            <div style={{ fontSize: 10, color: COLORS.accent, marginBottom: 8 }}>escalation_note</div>
            <div style={{ fontSize: 10, color: COLORS["fg-dim"], fontFamily: "monospace" }}>
              To: Sarah Chen... vendor contract at risk...
            </div>
          </div>
        )}
      </div>
      
      <MouseCursor x={cursorX} y={cursorY} delay={150} />
      {moveClick > 0 && <ClickEffect x={btnX} y={btnY} delay={170} />}
    </AbsoluteFill>
  );
};

export const Scene8_Closing = () => {
  const f = useCurrentFrame() - 1860;
  
  const sub = interpolate(f, [20, 60], [0, 1], { extrapolateClamp: true });
  const title = interpolate(f, [60, 100], [0, 1], { extrapolateClamp: true });
  const cta = interpolate(f, [100, 140], [0, 1], { extrapolateClamp: true });
  const fade = interpolate(f, [220, 240], [1, 0], { extrapolateClamp: true });
  
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, opacity: fade }}>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 24, color: COLORS["fg-mute"], opacity: sub }}>From chaos to clarity</div>
          <div style={{ fontSize: 64, fontWeight: 700, color: COLORS.fg, letterSpacing: "-0.02em", marginTop: 20, opacity: title }}>ConsultFlow</div>
          <div style={{ fontSize: 48, fontWeight: 700, color: COLORS.accent, marginTop: 24, opacity: cta }}>Stop tracking.</div>
          <div style={{ fontSize: 48, fontWeight: 700, color: COLORS.accent, opacity: cta }}>Start consulting.</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};