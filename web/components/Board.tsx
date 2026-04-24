import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  PointerSensor,
  closestCenter,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CardContent } from "@/components/Card";
import type { ConsultItem } from "@/types/schema";
import { useEffect, useRef, useState } from "react";

type BoardProps = {
  items: ConsultItem[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onAddItem: (status: ConsultItem["status"], title: string) => void;
  onStatusChange: (id: string, status: ConsultItem["status"]) => void;
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
    label: "Awaiting client",
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

function SortableCard({
  item,
  selected,
  onClick,
}: {
  item: ConsultItem;
  selected: boolean;
  onClick: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
      }}
    >
      <button
        type="button"
        onClick={onClick}
        {...attributes}
        {...listeners}
        className="relative w-full animate-cardIn rounded-md bg-bg-1 p-[10px] text-left transition-colors hover:border hover:border-white"
      >
        <CardContent item={item} selected={selected} />
      </button>
    </div>
  );
}

function ColumnSection({
  column,
  columnItems,
  selectedId,
  isAddingHere,
  loading,
  onAddItem,
  onSelect,
  draftTitle,
  setDraftTitle,
  inputRef,
  addingToColumn,
  setAddingToColumn,
}: {
  column: (typeof columns)[0];
  columnItems: ConsultItem[];
  selectedId: string | null;
  isAddingHere: boolean;
  loading: boolean;
  onAddItem: (status: ConsultItem["status"], title: string) => void;
  onSelect: (id: string) => void;
  draftTitle: string;
  setDraftTitle: (v: string) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
  addingToColumn: ConsultItem["status"] | null;
  setAddingToColumn: (v: ConsultItem["status"] | null) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: column.key });

  const cancelAdd = () => {
    setAddingToColumn(null);
    setDraftTitle("");
  };

  const submitAdd = () => {
    const title = draftTitle.trim();
    if (!title) return;
    onAddItem(column.key, title);
    cancelAdd();
  };

  return (
    <section
      ref={setNodeRef}
      className={`flex min-h-0 min-w-0 flex-col border-r border-line last:border-r-0 transition-colors duration-150 ${
        isOver ? "border-accent bg-[rgba(99,102,241,0.06)]" : ""
      }`}
    >
      <div className="sticky top-0 z-[1] flex items-center gap-2 border-b border-line bg-bg px-3 py-[10px] text-[11.5px] font-semibold uppercase tracking-[0.06em] text-fg-dim">
        <span className={`h-[7px] w-[7px] rounded-[2px] ${column.swatchClass}`} />
        <span>{column.label}</span>
        <span className="ml-auto text-fg-faint">{columnItems.length}</span>
        <button
          type="button"
          onClick={() => {
            setAddingToColumn(column.key);
            setDraftTitle("");
          }}
          className="rounded px-1.5 py-0.5 text-fg-mute transition hover:bg-bg-2 hover:text-fg"
          title={`Add item to ${column.label}`}
        >
          +
        </button>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-1.5 overflow-y-auto p-2 pb-10">
        <SortableContext items={columnItems.map((i) => i.id)}>
          {isAddingHere && !loading ? (
            <div className="mb-1.5 rounded-md border border-accent bg-bg-2 px-2 py-2">
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  submitAdd();
                }}
              >
                <input
                  ref={inputRef}
                  value={draftTitle}
                  onChange={(event) => setDraftTitle(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Escape") {
                      event.preventDefault();
                      cancelAdd();
                    }
                  }}
                  placeholder="Item title…"
                  className="w-full bg-transparent text-sm text-fg outline-none placeholder:text-fg-faint"
                />
                <div className="mt-2 flex items-center gap-2">
                  <button
                    type="submit"
                    disabled={draftTitle.trim().length === 0}
                    className="rounded-md bg-accent px-2.5 py-1 text-[11px] font-semibold text-bg transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={cancelAdd}
                    className="rounded-md border border-line bg-bg px-2.5 py-1 text-[11px] text-fg-dim transition hover:border-line-2 hover:text-fg"
                    title="Cancel"
                  >
                    ×
                  </button>
                </div>
              </form>
            </div>
          ) : null}
          {loading ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : columnItems.length > 0 ? (
            columnItems.map((item) => (
              <SortableCard
                key={item.id}
                item={item}
                selected={selectedId === item.id}
                onClick={() => onSelect(item.id)}
              />
            ))
          ) : (
            <div className="flex min-h-[60px] items-center justify-center rounded-md border border-dashed border-line bg-bg-1 px-3 py-4 text-sm text-fg-mute">
              No items
            </div>
          )}
        </SortableContext>
      </div>
    </section>
  );
}

export default function Board({
  items,
  selectedId,
  onSelect,
  onAddItem,
  onStatusChange,
  loading = false,
}: BoardProps) {
  const [addingToColumn, setAddingToColumn] = useState<ConsultItem["status"] | null>(
    null,
  );
  const [draftTitle, setDraftTitle] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
  );

  useEffect(() => {
    if (addingToColumn) {
      window.setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  }, [addingToColumn]);

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const targetColumn = columns.find((col) => col.key === overId);
    if (targetColumn) {
      onStatusChange(activeId, targetColumn.key);
      return;
    }

    const overItem = items.find((i) => i.id === overId);
    if (overItem) {
      onStatusChange(activeId, overItem.status);
    }
  };

  if (!loading && items.length === 0) {
    return (
      <section className="panel flex h-full min-h-0 flex-col overflow-hidden">
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-fg-faint">
              Workspace
            </div>
            <h2 className="mt-1 text-base font-semibold text-fg">Extracted items</h2>
          </div>
          <div className="text-[11px] text-fg-mute">0 total</div>
        </div>

        <div className="grid min-h-0 flex-1 place-items-center p-6">
          <div className="max-w-[320px] rounded-xl border border-dashed border-line bg-bg-1 p-6 text-center">
            <div className="text-[11px] uppercase tracking-[0.14em] text-fg-faint">
              Empty board
            </div>
            <div className="mt-2 text-lg font-semibold text-fg">
              Parse a source to populate the board
            </div>
            <p className="mt-3 text-sm leading-6 text-fg-dim">
              Action items, blockers, risks, and client dependencies will land here as
              structured cards after extraction runs.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={(event) => setActiveId(event.active.id as string)}
      onDragEnd={handleDragEnd}
    >
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
            const isAddingHere = addingToColumn === column.key;

            return (
              <ColumnSection
                key={column.key}
                column={column}
                columnItems={columnItems}
                selectedId={selectedId}
                isAddingHere={isAddingHere}
                loading={loading}
                onAddItem={onAddItem}
                onSelect={onSelect}
                draftTitle={draftTitle}
                setDraftTitle={setDraftTitle}
                inputRef={inputRef}
                addingToColumn={addingToColumn}
                setAddingToColumn={setAddingToColumn}
              />
            );
          })}
        </div>
      </section>

      <DragOverlay>
        {activeId ? (() => {
          const item = items.find((i) => i.id === activeId);
          return item ? (
            <div className="w-[200px] rounded-md border border-accent bg-bg-1 p-[10px] shadow-[0_8px_24px_rgba(0,0,0,0.5)]">
              <div className="mb-1 flex items-center gap-1.5 text-[10.5px] text-fg-faint">
                <span className="mono">{item.id}</span>
              </div>
              <div className="text-[12.5px] font-medium leading-[1.35] text-fg line-clamp-2">
                {item.title}
              </div>
            </div>
          ) : null;
        })() : null}
      </DragOverlay>
    </DndContext>
  );
}