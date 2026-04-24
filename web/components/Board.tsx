import Card from "@/components/Card";
import type { ConsultItem } from "@/types/schema";

type BoardProps = {
  items: ConsultItem[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  loading?: boolean;
};

const columns: Array<{
  key: ConsultItem["status"];
  label: string;
  swatchClass: string;
}> = [
  { key: "todo", label: "Todo", swatchClass: "bg-fg-mute" },
  {
    key: "doing",
    label: "In progress",
    swatchClass: "bg-accent shadow-[0_0_6px_var(--accent)]",
  },
  {
    key: "waiting",
    label: "Waiting on client",
    swatchClass: "bg-info shadow-[0_0_6px_var(--info)]",
  },
  { key: "done", label: "Done", swatchClass: "bg-ok" },
];

function SkeletonCard() {
  return (
    <div className="shimmer rounded-md border border-line bg-bg-1 p-[10px]">
      <div className="h-2.5 w-2/5 rounded bg-bg-3" />
      <div className="mt-3 h-3 w-[88%] rounded bg-bg-3" />
      <div className="mt-2 h-3 w-[62%] rounded bg-bg-3" />
      <div className="mt-3 h-2.5 w-1/2 rounded bg-bg-3" />
    </div>
  );
}

export default function Board({
  items,
  selectedId,
  onSelect,
  loading = false,
}: BoardProps) {
  return (
    <section className="panel flex h-full min-h-0 flex-col overflow-hidden">
      <div className="flex items-center justify-between border-b border-line px-5 py-4">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-fg-faint">
            Workspace
          </div>
          <h2 className="mt-1 text-base font-semibold text-fg">Extracted items</h2>
        </div>
        <div className="text-[11px] text-fg-mute">{items.length} total</div>
      </div>

      <div className="flex h-10 items-center gap-2 border-b border-line px-4 text-[12px] text-fg-dim">
        <span className="inline-flex items-center gap-1.5 rounded-[4px] border border-dashed border-line-2 px-2 py-1 text-[11.5px]">
          <svg
            width="10"
            height="10"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path d="M3 6h18M7 12h10M10 18h4" />
          </svg>
          All types
        </span>
        <span className="inline-flex items-center rounded-[4px] border border-dashed border-line-2 px-2 py-1 text-[11.5px]">
          Any owner
        </span>
        <span className="inline-flex items-center rounded-[4px] border border-dashed border-line-2 px-2 py-1 text-[11.5px]">
          This sprint
        </span>
        <span className="ml-auto text-[11px] text-fg-faint">
          Group: <b className="font-medium text-fg-dim">Status</b>
        </span>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-4">
        {columns.map((column) => {
          const columnItems = items.filter((item) => item.status === column.key);

          return (
            <section
              key={column.key}
              className="flex min-h-0 min-w-0 flex-col border-r border-line last:border-r-0"
            >
              <div className="sticky top-0 z-[1] flex items-center gap-2 border-b border-line bg-bg px-3 py-[10px] text-[11.5px] font-semibold uppercase tracking-[0.06em] text-fg-dim">
                <span className={`h-[7px] w-[7px] rounded-[2px] ${column.swatchClass}`} />
                <span>{column.label}</span>
                <span className="ml-auto text-fg-faint">{columnItems.length}</span>
                <span className="text-fg-mute">+</span>
              </div>

              <div className="flex min-h-0 flex-1 flex-col gap-1.5 overflow-y-auto p-2 pb-10">
                {loading ? (
                  <>
                    <SkeletonCard />
                    <SkeletonCard />
                    <SkeletonCard />
                  </>
                ) : columnItems.length > 0 ? (
                  columnItems.map((item) => (
                    <Card
                      key={item.id}
                      item={item}
                      selected={selectedId === item.id}
                      onClick={() => onSelect(item.id)}
                    />
                  ))
                ) : (
                  <div className="rounded-md border border-dashed border-line bg-bg-1 px-3 py-4 text-sm text-fg-mute">
                    No items in {column.label.toLowerCase()}.
                  </div>
                )}
              </div>
            </section>
          );
        })}
      </div>
    </section>
  );
}
