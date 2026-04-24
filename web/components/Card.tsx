import type { ConsultItem } from "@/types/schema";

type CardProps = {
  item: ConsultItem;
  selected?: boolean;
  onClick: () => void;
};

const kindMeta = {
  task: {
    label: "Task",
    className: "bg-bg-3 text-fg-dim",
  },
  blocker: {
    label: "Blocker",
    className: "bg-[var(--warn-weak)] text-warn",
  },
  risk: {
    label: "Risk",
    className: "bg-[var(--danger-weak)] text-danger",
  },
  waiting: {
    label: "Client dependency",
    className: "bg-[var(--info-weak)] text-info",
  },
} satisfies Record<
  ConsultItem["kind"],
  {
    label: string;
    className: string;
  }
>;

const ownerGradients: Record<string, string> = {
  LR: "from-[#f472b6] to-[#db2777]",
  MK: "from-[#22d3ee] to-[#0891b2]",
  JS: "from-[#fb923c] to-[#ea580c]",
  AP: "from-[#a78bfa] to-[#7c3aed]",
  CL: "from-[#34d399] to-[#059669]",
  PM: "from-[#f472b6] to-[#db2777]",
};

function getDueClass(dueFlag: ConsultItem["dueFlag"]) {
  if (dueFlag === "overdue") {
    return "text-danger";
  }

  if (dueFlag === "soon") {
    return "text-warn";
  }

  return "text-fg-mute";
}

export default function Card({
  item,
  selected = false,
  onClick,
}: CardProps) {
  const meta = kindMeta[item.kind];
  const ownerGradient = ownerGradients[item.owner] ?? ownerGradients.MK;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative w-full animate-cardIn rounded-md border bg-bg-1 p-[10px] text-left transition hover:border-line-2 hover:bg-bg-2 ${
        item.waiting || item.status === "waiting"
          ? "border-[rgba(56,189,248,0.45)] bg-[rgba(14,38,54,0.2)]"
          : "border-line"
      } ${selected ? "ring-1 ring-accent ring-offset-0" : ""}`}
    >
      {item.waiting || item.status === "waiting" ? (
        <span className="absolute bottom-2 left-0 top-2 w-0.5 rounded-r-sm bg-info shadow-[0_0_10px_var(--info)]" />
      ) : null}

      <div className="mb-1 flex items-center gap-1.5 text-[10.5px] text-fg-faint">
        <span className="mono">{item.id}</span>
        {!(item.waiting || item.status === "waiting") ? (
          <span
            className={`inline-flex items-center rounded-[3px] px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.05em] ${meta.className}`}
          >
            {meta.label}
          </span>
        ) : null}
        {item.waiting || item.status === "waiting" ? (
          <span className="inline-flex items-center rounded-[3px] bg-[var(--info-weak)] px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.05em] text-info">
            {item.tags[0] ?? "awaiting"}
          </span>
        ) : null}
      </div>

      <div className="text-[12.5px] font-medium leading-[1.35] text-fg">
        {item.title}
      </div>

      <div className="mt-2 flex items-center gap-2 text-[10.5px] text-fg-mute">
        <span
          title={item.ownerName}
          className={`grid h-4 w-4 shrink-0 place-items-center rounded-full bg-gradient-to-br text-[9px] font-semibold text-white ${ownerGradient}`}
        >
          {item.owner}
        </span>
        <span className={getDueClass(item.dueFlag)}>{item.due}</span>
        {item.tags[0] ? (
          <>
            <span className="text-fg-faint">·</span>
            <span>{item.tags[0]}</span>
          </>
        ) : null}
      </div>
    </button>
  );
}
