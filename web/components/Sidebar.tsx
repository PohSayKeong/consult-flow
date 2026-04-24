import Link from "next/link";

type SidebarProps = {
  items: Array<{ kind: "task" | "blocker" | "risk" | "waiting"; waiting: boolean }>;
  collapsed: boolean;
  onToggle: () => void;
};

const navBase = [
  { label: "Inbox", icon: "◌", href: null },
  { label: "My Tasks", icon: "✓", href: null },
  { label: "Waiting on Client", icon: "↗", href: null },
  { label: "Risks", icon: "!", href: null },
];

const engagements = [
  { name: "Acme Corp", color: "#7c7aff", count: 14, active: true },
  { name: "Northstar", color: "#34d399", count: 6 },
  { name: "Helio", color: "#f59e0b", count: 3 },
];

const views = ["Board", "Timeline", "Client digest"];

function ChevronIcon({ collapsed }: { collapsed: boolean }) {
  return (
    <svg
      viewBox="0 0 20 20"
      width="14"
      height="14"
      aria-hidden="true"
      className={`transition-transform duration-200 ${collapsed ? "rotate-180" : ""}`}
    >
      <path
        d="M12.5 4.75 7.25 10l5.25 5.25"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Sidebar({ items, collapsed, onToggle }: SidebarProps) {
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
    <aside className="relative flex min-h-0 flex-col border-r border-line bg-bg-1 transition-all duration-200">
      <button
        type="button"
        onClick={onToggle}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        className="absolute right-1 top-3 z-20 grid h-8 w-8 place-items-center rounded-md border border-line-2 bg-bg-2 text-fg transition hover:border-line-2 hover:bg-bg-3"
        style={{ boxShadow: "0 0 0 1px var(--accent-glow)" }}
      >
        <span className="mono text-sm leading-none" aria-hidden="true">
          {collapsed ? "›" : "‹"}
        </span>
      </button>

      <div
        className={`flex items-center border-b border-line py-4 ${
          collapsed ? "flex-col justify-center gap-2 px-2" : "gap-3 px-4"
        }`}
      >
        <div className="h-6 w-6 overflow-hidden rounded-md">
          <img src="/consultflow.png" alt="ConsultFlow" className="h-full w-full object-contain" />
        </div>
        {collapsed ? (
          <span
            className="h-1.5 w-1.5 rounded-full bg-ok shadow-[0_0_10px_var(--ok)]"
            aria-hidden="true"
          />
        ) : (
          <div className="flex items-center gap-2 text-sm font-semibold text-fg">
            <span>ConsultFlow</span>
            <span className="h-1.5 w-1.5 rounded-full bg-ok shadow-[0_0_10px_var(--ok)]" />
          </div>
        )}
      </div>

      <div className={`${collapsed ? "px-1 pt-2" : "px-2 pt-3"}`}>
        {collapsed ? null : (
          <div className="px-2 py-1 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-fg-faint">
            Navigation
          </div>
        )}
        <div className={`space-y-1 ${collapsed ? "pt-1" : ""}`}>
          {navItems.map((item, index) => {
            const content = (
              <button
                key={item.label}
                type="button"
                title={collapsed ? item.label : undefined}
                aria-label={collapsed ? item.label : undefined}
                className={`flex w-full items-center rounded-md text-left text-sm transition ${
                  collapsed ? "justify-center px-0 py-2" : "gap-3 px-3 py-2"
                } ${
                  index === 0
                    ? "bg-bg-2 text-fg"
                    : "text-fg-dim hover:bg-bg-2 hover:text-fg"
                }`}
              >
                <span className="mono w-4 text-center text-xs">{item.icon}</span>
                {collapsed ? null : (
                  <>
                    <span>{item.label}</span>
                    <span className="ml-auto text-[11px] text-fg-mute">{item.count}</span>
                  </>
                )}
              </button>
            );
            return item.href ? (
              <Link key={item.label} href={item.href} style={{ display: "block" }}>
                {content}
              </Link>
            ) : (
              <div key={item.label}>{content}</div>
            );
          })}
        </div>
      </div>

      <div className={`${collapsed ? "px-1 pt-4" : "px-2 pt-4"}`}>
        {collapsed ? null : (
          <div className="px-2 py-1 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-fg-faint">
            Engagements
          </div>
        )}
        <div className="space-y-1">
          {engagements.map((item) => (
            <button
              key={item.name}
              type="button"
              title={collapsed ? item.name : undefined}
              aria-label={collapsed ? item.name : undefined}
              className={`flex w-full items-center rounded-md text-left text-sm transition ${
                collapsed ? "justify-center px-0 py-2" : "gap-3 px-3 py-2"
              } ${
                item.active
                  ? "bg-bg-2 text-fg"
                  : "text-fg-dim hover:bg-bg-2 hover:text-fg"
              }`}
            >
              <span
                className="h-2 w-2 rounded-sm"
                style={{ backgroundColor: item.color }}
              />
              {collapsed ? null : (
                <>
                  <span>{item.name}</span>
                  <span className="ml-auto text-[11px] text-fg-mute">{item.count}</span>
                </>
              )}
            </button>
          ))}
        </div>
      </div>

      {collapsed ? null : (
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
      )}

      <div
        className={`mt-auto flex items-center border-t border-line py-4 text-sm text-fg-dim ${
          collapsed ? "justify-center px-2" : "gap-3 px-4"
        }`}
      >
        <div className="grid h-6 w-6 place-items-center rounded-full bg-[linear-gradient(135deg,#6366f1,#a855f7)] text-[11px] font-semibold text-white">
          SK
        </div>
        {collapsed ? null : (
          <div>
            <div className="text-fg">Sam Kim</div>
            <div className="text-xs text-fg-mute">Delivery lead</div>
          </div>
        )}
      </div>
    </aside>
  );
}
