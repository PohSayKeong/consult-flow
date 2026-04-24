"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Task = {
  id: string;
  title: string;
  description: string;
  stage: string;
  owner: "claude" | "codex";
  status: "todo" | "done";
  dependencies: string[];
  output: string;
  files: string[];
  updated_at: string;
};

type TasksData = {
  project: string;
  last_updated: string;
  tasks: Task[];
};

const STAGES = ["ingest", "plan", "execute", "communicate"] as const;

const STAGE_LABELS: Record<string, string> = {
  ingest: "Ingest",
  plan: "Plan",
  execute: "Execute",
  communicate: "Communicate",
};

const STAGE_COLORS: Record<string, string> = {
  ingest: "var(--info)",
  plan: "var(--accent)",
  execute: "var(--warn)",
  communicate: "var(--ok)",
};

function OwnerBadge({ owner }: { owner: string }) {
  const isClaude = owner === "claude";
  return (
    <span
      style={{
        background: isClaude ? "var(--accent-weak)" : "var(--info-weak)",
        color: isClaude ? "var(--accent)" : "var(--info)",
        border: `1px solid ${isClaude ? "var(--accent-weak)" : "var(--info-weak)"}`,
        borderRadius: 4,
        padding: "1px 7px",
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: "0.04em",
      }}
    >
      {owner}
    </span>
  );
}

function StatusDot({ status }: { status: string }) {
  const done = status === "done";
  return (
    <span
      style={{
        display: "inline-block",
        width: 7,
        height: 7,
        borderRadius: "50%",
        background: done ? "var(--ok)" : "var(--fg-faint)",
        flexShrink: 0,
        marginTop: 1,
      }}
    />
  );
}

function TaskCard({ task, allTasks }: { task: Task; allTasks: Task[] }) {
  const [expanded, setExpanded] = useState(false);
  const done = task.status === "done";

  const depTasks = task.dependencies
    .map((depId) => allTasks.find((t) => t.id === depId))
    .filter(Boolean) as Task[];

  return (
    <button
      type="button"
      onClick={() => setExpanded((v) => !v)}
style={{
        display: "block",
        width: "100%",
        textAlign: "left",
        background: done ? "var(--ok-weak)" : "var(--bg-2)",
        border: `1px solid ${done ? "rgba(34,197,94,0.2)" : "var(--line)"}`,
        borderRadius: 8,
        padding: "11px 13px",
        cursor: "pointer",
        transition: "border-color 120ms",
        opacity: done ? 0.85 : 1,
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: 7 }}>
        <StatusDot status={task.status} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              marginBottom: 4,
              flexWrap: "wrap",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-jetbrains-mono), monospace",
                fontSize: 10,
                color: "var(--fg-faint)",
                letterSpacing: "0.04em",
              }}
            >
              {task.id}
            </span>
            <OwnerBadge owner={task.owner} />
          </div>
          <div
            style={{
              fontSize: 12,
              fontWeight: 500,
              color: done ? "var(--fg-dim)" : "var(--fg)",
              lineHeight: 1.4,
              textDecoration: done ? "line-through" : "none",
            }}
          >
            {task.title}
          </div>

          {task.dependencies.length > 0 && (
            <div
              style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 7 }}
            >
              {depTasks.map((dep) => (
                <span
                  key={dep.id}
                  style={{
                    fontSize: 10,
                    padding: "1px 5px",
                    borderRadius: 3,
                    background: dep.status === "done" ? "var(--ok-weak)" : "var(--bg-3)",
                    color: dep.status === "done" ? "var(--ok)" : "var(--fg-mute)",
                    border: `1px solid ${dep.status === "done" ? "rgba(34,197,94,0.15)" : "var(--line)"}`,
                    fontFamily: "var(--font-jetbrains-mono), monospace",
                  }}
                >
                  {dep.id}
                </span>
              ))}
            </div>
          )}

          {expanded && (
            <div style={{ marginTop: 10 }}>
              <p
                style={{
                  fontSize: 11,
                  color: "var(--fg-dim)",
                  lineHeight: 1.6,
                  margin: 0,
                  marginBottom: 8,
                }}
              >
                {task.description}
              </p>

              {task.output && (
                <div
                  style={{
                    background: "var(--bg-1)",
                    border: "1px solid var(--line)",
                    borderRadius: 5,
                    padding: "8px 10px",
                    marginBottom: 8,
                  }}
                >
                  <div
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: "var(--ok)",
                      letterSpacing: "0.1em",
                      marginBottom: 4,
                    }}
                  >
                    OUTPUT
                  </div>
                  <p style={{ fontSize: 11, color: "var(--fg-dim)", margin: 0, lineHeight: 1.5 }}>
                    {task.output}
                  </p>
                </div>
              )}

              {task.files.length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  {task.files.map((f) => (
                    <span
                      key={f}
                      style={{
                        fontFamily: "var(--font-jetbrains-mono), monospace",
                        fontSize: 10,
                        color: "var(--accent)",
                        background: "var(--accent-weak)",
                        borderRadius: 3,
                        padding: "1px 5px",
                        display: "inline-block",
                        width: "fit-content",
                      }}
                    >
                      {f}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
        <span
          style={{
            fontSize: 11,
            color: "var(--fg-faint)",
            marginTop: 1,
            flexShrink: 0,
            transition: "transform 120ms",
            transform: expanded ? "rotate(90deg)" : "none",
          }}
        >
          ›
        </span>
      </div>
    </button>
  );
}

function StageColumn({
  stage,
  tasks,
  allTasks,
}: {
  stage: string;
  tasks: Task[];
  allTasks: Task[];
}) {
  const done = tasks.filter((t) => t.status === "done").length;
  const color = STAGE_COLORS[stage] ?? "var(--fg-mute)";

  return (
    <div
      style={{
        flex: "0 0 300px",
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 12,
          paddingBottom: 10,
          borderBottom: `1px solid var(--line)`,
        }}
      >
        <span
          style={{
            display: "inline-block",
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: color,
            flexShrink: 0,
          }}
        />
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "var(--fg)",
          }}
        >
          {STAGE_LABELS[stage] ?? stage}
        </span>
        <span
          style={{
            fontSize: 11,
            color: "var(--fg-faint)",
            fontFamily: "var(--font-jetbrains-mono), monospace",
          }}
        >
          {done}/{tasks.length}
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8, overflowY: "auto" }}>
        {[...tasks].sort((a, b) => (a.status === "done" ? 1 : 0) - (b.status === "done" ? 1 : 0)).map((task) => (
          <TaskCard key={task.id} task={task} allTasks={allTasks} />
        ))}
        {tasks.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "24px 0",
              color: "var(--fg-faint)",
              fontSize: 12,
            }}
          >
            No tasks
          </div>
        )}
      </div>
    </div>
  );
}

export default function TasksPage() {
  const [data, setData] = useState<TasksData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/tasks")
      .then((r) => r.json())
      .then(setData)
      .catch((e) => setError(String(e)));
  }, []);

  if (error) {
    return (
      <div style={{ padding: 32, color: "var(--danger)" }}>
        Failed to load tasks: {error}
      </div>
    );
  }

  if (!data) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--fg-faint)",
          fontSize: 13,
        }}
      >
        Loading...
      </div>
    );
  }

  const totalDone = data.tasks.filter((t) => t.status === "done").length;
  const total = data.tasks.length;
  const pct = Math.round((totalDone / total) * 100);

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "20px 24px",
        display: "flex",
        flexDirection: "column",
        gap: 20,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          borderBottom: "1px solid var(--line)",
          paddingBottom: 16,
        }}
      >
        <Link
          href="/"
          style={{
            fontSize: 12,
            color: "var(--fg-faint)",
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          ← Home
        </Link>
        <div
          style={{
            width: 1,
            height: 14,
            background: "var(--line-2)",
          }}
        />
        <div>
          <h1
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: "var(--fg)",
              margin: 0,
              letterSpacing: "-0.01em",
            }}
          >
            {data.project}
          </h1>
          <div style={{ fontSize: 11, color: "var(--fg-faint)", marginTop: 2 }}>
            tasks.json
          </div>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                width: 120,
                height: 4,
                background: "var(--bg-3)",
                borderRadius: 99,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${pct}%`,
                  height: "100%",
                  background: "var(--ok)",
                  borderRadius: 99,
                  transition: "width 600ms ease",
                }}
              />
            </div>
            <span
              style={{
                fontSize: 11,
                color: "var(--fg-mute)",
                fontFamily: "var(--font-jetbrains-mono), monospace",
              }}
            >
              {totalDone}/{total}
            </span>
          </div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          gap: 24,
          overflowX: "auto",
          overflowY: "hidden",
          flex: 1,
          paddingBottom: 20,
        }}
      >
        {STAGES.map((stage) => (
          <StageColumn
            key={stage}
            stage={stage}
            tasks={data.tasks.filter((t) => t.stage === stage)}
            allTasks={data.tasks}
          />
        ))}
      </div>
    </div>
  );
}