import { useCurrentFrame, interpolate, AbsoluteFill, Img } from "remotion";
import consultflowLogo from "./consultflow.png";
import anthropicLogo from "./anthropic-1.svg";

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

const SLIDE = 75; // 2.5s at 30fps
const FADE_IN = 15; // 0.5s fade in

const fadeIn = (localF: number) =>
  interpolate(localF, [0, FADE_IN], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

const SCENES = {
  intro:   { start: 0,         end: SLIDE },
  pills:   { start: SLIDE,     end: SLIDE * 2 },
  sources: { start: SLIDE * 2, end: SLIDE * 3 },
  agents:  { start: SLIDE * 3, end: SLIDE * 4 },
};

export const totalFrames = SLIDE * 4;

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

export const Intro = () => {
  const f = useCurrentFrame();
  if (f < SCENES.intro.start || f >= SCENES.intro.end) return null;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, justifyContent: "center", alignItems: "center", opacity: fadeIn(f - SCENES.intro.start) }}>
      <div style={{ textAlign: "center" }}>
        <Img src={consultflowLogo} style={{ width: 500, height: "auto" }} />
        <div style={{ fontSize: 36, color: COLORS["fg-dim"], marginTop: 32, fontFamily: "Space Grotesk, sans-serif" }}>
          AI-Powered Consulting Workflow
        </div>
        <div style={{ marginTop: 64 }}>
          <div style={{ fontSize: 28, color: COLORS["fg-mute"], marginBottom: 16 }}>Turn messy client interactions into</div>
          <div style={{ fontSize: 44, color: COLORS.accent, fontWeight: 700 }}>organized action, instantly</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const PillsSlide = () => {
  const f = useCurrentFrame();
  if (f < SCENES.pills.start || f >= SCENES.pills.end) return null;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, justifyContent: "center", alignItems: "center", opacity: fadeIn(f - SCENES.pills.start) }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 32, color: COLORS["fg-mute"], marginBottom: 48 }}>Everything you need to stay on top of client work</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 900, alignItems: "center" }}>
          {FEATURES.map((feat) => (
            <div key={feat} style={{ padding: "24px 40px", borderRadius: 20, fontSize: 22, color: COLORS.fg, backgroundColor: COLORS["bg-2"], border: `1px solid ${COLORS.line}`, width: 700, textAlign: "left", display: "flex", alignItems: "center", gap: 20 }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", backgroundColor: COLORS.accent, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
              </div>
              {feat}
            </div>
          ))}
        </div>
        <div style={{ fontSize: 24, color: COLORS.accent, marginTop: 48 }}>All of this, powered by AI</div>
      </div>
    </AbsoluteFill>
  );
};

export const SourcesSlide = () => {
  const f = useCurrentFrame();
  if (f < SCENES.sources.start || f >= SCENES.sources.end) return null;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, justifyContent: "center", alignItems: "center", opacity: fadeIn(f - SCENES.sources.start) }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 48, color: COLORS["fg-mute"], marginBottom: 56 }}>Connect your data from anywhere</div>
        <div style={{ display: "flex", gap: 40, justifyContent: "center", marginBottom: 56 }}>
          {SOURCES.map((src) => (
            <div key={src.name} style={{ width: 200, height: 200, borderRadius: 32, backgroundColor: COLORS["bg-2"], border: `2px solid ${src.color}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <div style={{ marginBottom: 12, transform: "scale(1.3)" }}>{src.icon}</div>
              <div style={{ fontSize: 26, color: COLORS.fg, fontWeight: 600 }}>{src.name}</div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 32, padding: "24px 52px", backgroundColor: COLORS["bg-1"], borderRadius: 20, border: `1px solid ${COLORS.line}` }}>
          <div style={{ fontSize: 48, color: COLORS["fg-mute"] }}>→</div>
          <div><div style={{ fontSize: 30, color: COLORS.fg, fontWeight: 700 }}>AI Processing</div><div style={{ fontSize: 22, color: COLORS["fg-dim"] }}>Extracts commitments, blockers, risks</div></div>
          <div style={{ fontSize: 48, color: COLORS["fg-mute"] }}>→</div>
          <div><div style={{ fontSize: 30, color: COLORS.accent, fontWeight: 700 }}>ConsultFlow</div><div style={{ fontSize: 22, color: COLORS["fg-dim"] }}>Organized dashboard</div></div>
        </div>
        <div style={{ fontSize: 28, color: COLORS["fg-mute"], marginTop: 56 }}>Gmail • Zoom • Slack • Teams • Text • More coming soon</div>
      </div>
    </AbsoluteFill>
  );
};

export const AgentsSlide = () => {
  const f = useCurrentFrame();
  if (f < SCENES.agents.start || f >= SCENES.agents.end) return null;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, justifyContent: "center", alignItems: "center", opacity: fadeIn(f - SCENES.agents.start) }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 48, color: COLORS["fg-mute"], marginBottom: 56 }}>Powered by Claude Managed Agents</div>

        <div style={{ display: "flex", gap: 40, justifyContent: "center", marginBottom: 56 }}>
          {AGENTS.map((agent, i) => (
            <div key={agent.name} style={{ width: 280, padding: "40px 32px", borderRadius: 32, backgroundColor: COLORS["bg-2"], border: `2px solid ${i === 0 ? COLORS.info : i === 1 ? COLORS.accent : COLORS.ok}`, display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ marginBottom: 24, transform: "scale(1.6)" }}>{agent.icon}</div>
              <div style={{ fontSize: 32, color: COLORS.fg, fontWeight: 700, marginBottom: 12 }}>{agent.name}</div>
              <div style={{ fontSize: 22, color: COLORS["fg-dim"] }}>{agent.desc}</div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 24, padding: "24px 48px", backgroundColor: COLORS["bg-1"], borderRadius: 20, border: `2px solid ${COLORS.accent}` }}>
          <Img src={anthropicLogo} style={{ width: 44, height: 44, filter: "brightness(0.6)" }} />
          <div style={{ fontSize: 22, color: COLORS["fg-mute"] }}>Each agent is a specialized Claude instance that runs autonomously</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
