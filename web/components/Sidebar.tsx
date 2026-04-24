type SidebarProps = {
  items: Array<{ kind: "task" | "blocker" | "risk" | "waiting"; waiting: boolean }>;
};

const navBase = [
  { label: "Inbox", icon: "◌" },
  { label: "My Tasks", icon: "✓" },
  { label: "Waiting on Client", icon: "↗" },
  { label: "Risks", icon: "!" },
];

const engagements = [
  { name: "Acme Corp", color: "#7c7aff", count: 14, active: true },
  { name: "Northstar", color: "#34d399", count: 6 },
  { name: "Helio", color: "#f59e0b", count: 3 },
];

const views = ["Board", "Timeline", "Client digest"];

export default function Sidebar({ items }: SidebarProps) {
  const waitingCount = items.filter((item) => item.waiting).length;
  const riskCount = items.filter((item) => item.kind === "risk").length;
  const taskCount = items.filter((item) => item.kind === "task").length;

  const navItems = navBase.map((item) => {
    if (item.label === "My Tasks") return { ...item, count: taskCount };
    if (item.label === "Waiting on Client") return { ...item, count: waitingCount };
    if (item.label === "Risks") return { ...item, count: riskCount };
    return { ...item, count: items.length };
  });

  return (
    <aside className="flex min-h-0 flex-col border-r border-line bg-bg-1">
      <div className="flex items-center gap-3 border-b border-line px-4 py-4">
        <div className="relative h-6 w-6 rounded-md border border-line-2 bg-[radial-gradient(circle_at_30%_30%,var(--accent),transparent_60%),linear-gradient(135deg,#2a2d3a,#0f1115)] shadow-[0_0_0_0.5px_var(--accent-glow),0_6px_20px_-8px_var(--accent-glow)]">
          <div className="absolute inset-[4px] rounded-full border border-transparent [background:conic-gradient(from_210deg,transparent_0_30%,var(--accent)_30%_55%,transparent_55%_100%)] [mask:radial-gradient(circle,transparent_40%,#000_41%)] [-webkit-mask:radial-gradient(circle,transparent_40%,#000_41%)]" />
        </div>
        <div className="flex items-center gap-2 text-sm font-semibold text-fg">
          <span>ConsultFlow</span>
          <span className="h-1.5 w-1.5 rounded-full bg-ok shadow-[0_0_10px_var(--ok)]" />
        </div>
      </div>

      <div className="px-2 pt-3">
        <div className="px-2 py-1 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-fg-faint">
          Navigation
        </div>
        <div className="space-y-1">
          {navItems.map((item, index) => (
            <button
              key={item.label}
              type="button"
              className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm transition ${
                index === 0
                  ? "bg-bg-2 text-fg"
                  : "text-fg-dim hover:bg-bg-2 hover:text-fg"
              }`}
            >
              <span className="mono w-4 text-center text-xs">{item.icon}</span>
              <span>{item.label}</span>
              <span className="ml-auto text-[11px] text-fg-mute">{item.count}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="px-2 pt-4">
        <div className="px-2 py-1 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-fg-faint">
          Engagements
        </div>
        <div className="space-y-1">
          {engagements.map((item) => (
            <button
              key={item.name}
              type="button"
              className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm transition ${
                item.active
                  ? "bg-bg-2 text-fg"
                  : "text-fg-dim hover:bg-bg-2 hover:text-fg"
              }`}
            >
              <span
                className="h-2 w-2 rounded-sm"
                style={{ backgroundColor: item.color }}
              />
              <span>{item.name}</span>
              <span className="ml-auto text-[11px] text-fg-mute">{item.count}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="px-2 pt-4">
        <div className="px-2 py-1 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-fg-faint">
          Views
        </div>
        <div className="space-y-1">
          {views.map((view, index) => (
            <button
              key={view}
              type="button"
              className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm transition ${
                index === 0
                  ? "bg-bg-2 text-fg"
                  : "text-fg-dim hover:bg-bg-2 hover:text-fg"
              }`}
            >
              <span>{view}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-auto flex items-center gap-3 border-t border-line px-4 py-4 text-sm text-fg-dim">
        <div className="grid h-6 w-6 place-items-center rounded-full bg-[linear-gradient(135deg,#6366f1,#a855f7)] text-[11px] font-semibold text-white">
          SK
        </div>
        <div>
          <div className="text-fg">Sam Kim</div>
          <div className="text-xs text-fg-mute">Delivery lead</div>
        </div>
      </div>
    </aside>
  );
}
