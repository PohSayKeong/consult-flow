import { useCurrentFrame, interpolate, AbsoluteFill, Img } from "remotion";
import React from "react";
import consultflowLogo from "./consultflow.png";

const COLORS = {
  bg: "#0b0c0f",
  "bg-1": "#0f1115",
  "bg-2": "#14171d",
  "bg-3": "#1a1e26",
  line: "#23262f",
  fg: "#e7e9ee",
  "fg-dim": "#a2a7b3",
  "fg-mute": "#6b7280",
  accent: "#7c7aff",
  accentGlow: "rgba(124, 122, 255, 0.18)",
  ok: "#22c55e",
  info: "#38bdf8",
};

const GmailIcon = () => (
  <svg viewBox="0 0 24 24" width="56" height="56" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="5" width="20" height="14" rx="2" fill="#EA4335"/>
    <path d="M2 7l10 7.5L22 7" stroke="white" strokeWidth="2"/>
  </svg>
);

const ZoomIcon = () => (
  <svg viewBox="0 0 24 24" width="56" height="56" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="4" width="20" height="16" rx="2" fill="#2D8CFF"/>
    <circle cx="12" cy="12" r="4" fill="white"/>
  </svg>
);

const TextIcon = () => (
  <svg viewBox="0 0 24 24" width="56" height="56" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="2" width="18" height="20" rx="2" fill="#7c7aff"/>
    <path d="M7 8h10M7 12h8M7 16h6" stroke="white" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const AgentIcon = ({ name }: { name: string }) => {
  const colors: Record<string, string> = {
    Extractor: COLORS.info,
    Execution: COLORS.accent,
    Email: COLORS.ok,
  };
  return (
    <svg viewBox="0 0 64 64" width="72" height="72">
      <circle cx="32" cy="32" r="28" fill={colors[name]} fillOpacity="0.2" stroke={colors[name]} strokeWidth="3"/>
      <text x="32" y="40" textAnchor="middle" fill={colors[name]} fontSize="28" fontWeight="bold">{name[0]}</text>
    </svg>
  );
};

const FEATURES = [
  "AI extracts commitments from calls & emails",
  "Auto-organizes into Kanban board",
  "Executive summaries in one click",
  "Automated action memos & follow-ups",
];

const AGENTS = [
  { name: "Extractor", icon: <AgentIcon name="Extractor" />, desc: "Parse calls & emails" },
  { name: "Execution", icon: <AgentIcon name="Execution" />, desc: "Summarize & plan" },
  { name: "Email", icon: <AgentIcon name="Email" />, desc: "Send digests" },
];

const SOURCES = [
  { name: "Gmail", icon: <GmailIcon />, color: "#EA4335" },
  { name: "Zoom", icon: <ZoomIcon />, color: "#2D8CFF" },
  { name: "Text", icon: <TextIcon />, color: COLORS.accent },
];

const SCENES = {
  intro: { start: 0, end: 270 },
  pills: { start: 270, end: 510 },
  sources: { start: 480, end: 720 },
  agents: { start: 690, end: 930 },
  outro: { start: 900, end: 1050 },
};

export const totalFrames = 1050;

export const Intro = () => {
  const f = useCurrentFrame();
  const inRange = f >= SCENES.intro.start && f < SCENES.intro.end;
  if (!inRange) return null;
  
  const localF = f - SCENES.intro.start;
  const mainFade = interpolate(localF, [0, 30, 240, 270], [0, 1, 1, 0], { extrapolateClamp: true });
  const subFade = interpolate(localF, [30, 70], [0, 1], { extrapolateClamp: true });
  const headline = interpolate(localF, [80, 120], [0, 1], { extrapolateClamp: true });
  
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, justifyContent: "center", alignItems: "center" }}>
      <div style={{ textAlign: "center", opacity: mainFade }}>
        <Img src={consultflowLogo} style={{ width: 500, height: "auto" }} />
        <div style={{ fontSize: 36, color: COLORS["fg-dim"], marginTop: 32, opacity: subFade, fontFamily: "Space Grotesk, sans-serif" }}>
          AI-Powered Consulting Workflow
        </div>
        <div style={{ marginTop: 64, opacity: headline }}>
          <div style={{ fontSize: 28, color: COLORS["fg-mute"], marginBottom: 16 }}>Turn messy client interactions into</div>
          <div style={{ fontSize: 44, color: COLORS.accent, fontWeight: 700 }}>organized action, instantly</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const PillsSlide = () => {
  const f = useCurrentFrame();
  const inRange = f >= SCENES.pills.start && f < SCENES.pills.end;
  if (!inRange) return null;
  
  const localF = f - SCENES.pills.start;
  const mainFade = interpolate(localF, [0, 30, 210, 240], [0, 1, 1, 0], { extrapolateClamp: true });
  const pill1 = interpolate(localF, [30, 70], [0, 1], { extrapolateClamp: true });
  const pill2 = interpolate(localF, [50, 90], [0, 1], { extrapolateClamp: true });
  const pill3 = interpolate(localF, [70, 110], [0, 1], { extrapolateClamp: true });
  const pill4 = interpolate(localF, [90, 130], [0, 1], { extrapolateClamp: true });
  const desc = interpolate(localF, [120, 160], [0, 1], { extrapolateClamp: true });
  
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, justifyContent: "center", alignItems: "center" }}>
      <div style={{ textAlign: "center", opacity: mainFade }}>
        <div style={{ fontSize: 32, color: COLORS["fg-mute"], marginBottom: 48 }}>Everything you need to stay on top of client work</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 900, alignItems: "center" }}>
          {FEATURES.map((feat, i) => (
            <div key={feat} style={{ padding: "24px 40px", borderRadius: 20, fontSize: 22, color: COLORS.fg, backgroundColor: COLORS["bg-2"], border: `1px solid ${COLORS.line}`, opacity: [pill1, pill2, pill3, pill4][i], width: 700, textAlign: "left", display: "flex", alignItems: "center", gap: 20 }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", backgroundColor: COLORS.accent, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
              </div>
              {feat}
            </div>
          ))}
        </div>
        <div style={{ fontSize: 24, color: COLORS.accent, marginTop: 48, opacity: desc }}>All of this, powered by AI</div>
      </div>
    </AbsoluteFill>
  );
};

export const SourcesSlide = () => {
  const f = useCurrentFrame();
  const inRange = f >= SCENES.sources.start && f < SCENES.sources.end;
  if (!inRange) return null;
  
  const localF = f - SCENES.sources.start;
  const mainFade = interpolate(localF, [0, 30, 210, 240], [0, 1, 1, 0], { extrapolateClamp: true });
  const title = interpolate(localF, [20, 60], [0, 1], { extrapolateClamp: true });
  const src1 = interpolate(localF, [50, 90], [0, 1], { extrapolateClamp: true });
  const src2 = interpolate(localF, [70, 110], [0, 1], { extrapolateClamp: true });
  const src3 = interpolate(localF, [90, 130], [0, 1], { extrapolateClamp: true });
  const bar = interpolate(localF, [110, 150], [0, 1], { extrapolateClamp: true });
  
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, justifyContent: "center", alignItems: "center", opacity: mainFade }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 36, color: COLORS["fg-mute"], marginBottom: 56, opacity: title }}>Connect your data from anywhere</div>
        <div style={{ display: "flex", gap: 32, justifyContent: "center", marginBottom: 56 }}>
          {SOURCES.map((src, i) => (
            <div key={src.name} style={{ width: 160, height: 160, borderRadius: 28, backgroundColor: COLORS["bg-2"], border: `2px solid ${src.color}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", opacity: [src1, src2, src3][i] }}>
              <div style={{ marginBottom: 12 }}>{src.icon}</div>
              <div style={{ fontSize: 20, color: COLORS.fg, fontWeight: 600 }}>{src.name}</div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 24, padding: "20px 40px", backgroundColor: COLORS["bg-1"], borderRadius: 20, border: `1px solid ${COLORS.line}`, opacity: bar }}>
          <div style={{ fontSize: 40, color: COLORS["fg-mute"] }}>→</div>
          <div><div style={{ fontSize: 24, color: COLORS.fg, fontWeight: 700 }}>AI Processing</div><div style={{ fontSize: 18, color: COLORS["fg-dim"] }}>Extracts commitments, blockers, risks</div></div>
          <div style={{ fontSize: 40, color: COLORS["fg-mute"] }}>→</div>
          <div><div style={{ fontSize: 24, color: COLORS.accent, fontWeight: 700 }}>ConsultFlow</div><div style={{ fontSize: 18, color: COLORS["fg-dim"] }}>Organized dashboard</div></div>
        </div>
        <div style={{ fontSize: 22, color: COLORS["fg-mute"], marginTop: 56, opacity: bar }}>Gmail • Zoom • Slack • Teams • Text • More coming soon</div>
      </div>
    </AbsoluteFill>
  );
};

export const AgentsSlide = () => {
  const f = useCurrentFrame();
  const inRange = f >= SCENES.agents.start && f < SCENES.agents.end;
  if (!inRange) return null;
  
  const localF = f - SCENES.agents.start;
  const mainFade = interpolate(localF, [0, 30, 210, 240], [0, 1, 1, 0], { extrapolateClamp: true });
  const title = interpolate(localF, [20, 60], [0, 1], { extrapolateClamp: true });
  const agent1 = interpolate(localF, [60, 100], [0, 1], { extrapolateClamp: true });
  const agent2 = interpolate(localF, [80, 120], [0, 1], { extrapolateClamp: true });
  const agent3 = interpolate(localF, [100, 140], [0, 1], { extrapolateClamp: true });
  const connect = interpolate(localF, [140, 180], [0, 1], { extrapolateClamp: true });
  
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, justifyContent: "center", alignItems: "center", opacity: mainFade }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 36, color: COLORS["fg-mute"], marginBottom: 56, opacity: title }}>Powered by Claude Managed Agents</div>
        
        <div style={{ display: "flex", gap: 32, justifyContent: "center", marginBottom: 56 }}>
          {AGENTS.map((agent, i) => (
            <div key={agent.name} style={{ width: 240, padding: "32px 24px", borderRadius: 28, backgroundColor: COLORS["bg-2"], border: `2px solid ${i === 0 ? COLORS.info : i === 1 ? COLORS.accent : COLORS.ok}`, display: "flex", flexDirection: "column", alignItems: "center", opacity: [agent1, agent2, agent3][i] }}>
              <div style={{ marginBottom: 20, transform: "scale(1.4)" }}>{agent.icon}</div>
              <div style={{ fontSize: 26, color: COLORS.fg, fontWeight: 700, marginBottom: 10 }}>{agent.name}</div>
              <div style={{ fontSize: 18, color: COLORS["fg-dim"] }}>{agent.desc}</div>
            </div>
          ))}
        </div>
        
        <div style={{ display: "flex", alignItems: "center", gap: 20, padding: "20px 40px", backgroundColor: COLORS["bg-1"], borderRadius: 20, border: `2px solid ${COLORS.accent}`, opacity: connect }}>
          <div style={{ fontSize: 16, color: COLORS["fg-mute"] }}>Each agent is a specialized Claude instance that runs autonomously</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const Outro = () => {
  const f = useCurrentFrame();
  const inRange = f >= SCENES.outro.start && f < SCENES.outro.end;
  if (!inRange) return null;
  
  const localF = f - SCENES.outro.start;
  const mainFade = interpolate(localF, [0, 30, 120, 150], [0, 1, 1, 0], { extrapolateClamp: true });
  const subtitle = interpolate(localF, [20, 60], [0, 1], { extrapolateClamp: true });
  const cta = interpolate(localF, [80, 120], [0, 1], { extrapolateClamp: true });
  
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, justifyContent: "center", alignItems: "center" }}>
      <div style={{ textAlign: "center", opacity: mainFade }}>
        <div style={{ fontSize: 32, color: COLORS["fg-mute"], opacity: subtitle }}>From chaos to clarity</div>
        <Img src={consultflowLogo} style={{ width: 450, height: "auto", marginTop: 32 }} />
        <div style={{ fontSize: 56, fontWeight: 700, color: COLORS.accent, marginTop: 48, opacity: cta }}>Stop tracking.</div>
        <div style={{ fontSize: 56, fontWeight: 700, color: COLORS.accent, opacity: cta }}>Start consulting.</div>
        <div style={{ display: "flex", gap: 40, justifyContent: "center", marginTop: 72 }}>
          <div style={{ textAlign: "center" }}><div style={{ fontSize: 40, fontWeight: 700, color: COLORS.ok }}>80%</div><div style={{ fontSize: 16, color: COLORS["fg-mute"] }}>less manual work</div></div>
          <div style={{ width: 2, backgroundColor: COLORS.line }} />
          <div style={{ textAlign: "center" }}><div style={{ fontSize: 40, fontWeight: 700, color: COLORS.info }}>10x</div><div style={{ fontSize: 16, color: COLORS["fg-mute"] }}>faster follow-ups</div></div>
          <div style={{ width: 2, backgroundColor: COLORS.line }} />
          <div style={{ textAlign: "center" }}><div style={{ fontSize: 40, fontWeight: 700, color: COLORS.accent }}>100%</div><div style={{ fontSize: 16, color: COLORS["fg-mute"] }}>client visibility</div></div>
        </div>
      </div>
    </AbsoluteFill>
  );
};