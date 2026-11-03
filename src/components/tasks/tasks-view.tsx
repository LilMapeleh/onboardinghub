"use client";

import { useState } from "react";
import { useJoiner } from "@/components/joiner/joiner-context";
import { TaskCard } from "@/components/tasks/task-card";
import { PageIntro } from "@/components/ui/primitives";
import { dateForDay, formatMedium } from "@/lib/dates";
import { priority, type TaskView } from "@/lib/selectors";

type Filter = "now" | "upcoming" | "done" | "all";

const filters: { id: Filter; label: string }[] = [
  { id: "now", label: "Now" },
  { id: "upcoming", label: "Upcoming" },
  { id: "done", label: "Done" },
  { id: "all", label: "All" },
];

function matches(task: TaskView, filter: Filter): boolean {
  if (filter === "all") return true;
  if (filter === "done") return task.status === "completed";
  if (filter === "upcoming") return task.status === "locked";
  return task.status !== "completed" && task.status !== "locked";
}

export function TasksView() {
  const { tasks, stage } = useJoiner();
  const [filter, setFilter] = useState<Filter>("now");
  const visible = tasks
    .filter((task) => matches(task, filter))
    .sort((a, b) => priority(a) - priority(b) || a.dueOnDay - b.dueOnDay);
  const next = tasks
    .filter((task) => task.status === "locked")
    .sort((a, b) => a.opensOnDay - b.opensOnDay)[0];

  return (
    <div>
      <PageIntro
        eyebrow={stage.name}
        title="What needs you."
        lede="Each task has an owner, a reason and a date. If the work happens in another system, the Hub points you there and keeps the record."
      />
      <div className="mb-5 flex flex-wrap gap-2">
        {filters.map((item) => {
          const count = tasks.filter((task) => matches(task, item.id)).length;
          const selected = filter === item.id;
          return (
            <button
              key={item.id}
              type="button"
              aria-pressed={selected}
              onClick={() => setFilter(item.id)}
              className={`rounded-full px-3 py-1.5 text-sm ${
                selected ? "bg-pine text-white" : "bg-card text-ink ring-1 ring-line"
              }`}
            >
              {item.label}
              <span className={`ml-2 ${selected ? "text-white/70" : "text-muted"}`}>{count}</span>
            </button>
          );
        })}
      </div>
      {visible.length === 0 ? (
        <p className="rounded-3xl border border-dashed border-line px-5 py-8 text-sm leading-relaxed text-muted">
          {filter === "now"
            ? next
              ? `You are clear. Next opens ${formatMedium(dateForDay(next.opensOnDay))}: ${next.title}.`
              : "You are clear."
            : "Nothing in this list."}
        </p>
      ) : (
        <div className="space-y-3">
          {visible.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      )}
    </div>
  );
}
