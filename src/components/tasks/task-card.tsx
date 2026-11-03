"use client";

import { useJoiner } from "@/components/joiner/joiner-context";
import { StatusPill, card } from "@/components/ui/primitives";
import type { TaskView } from "@/lib/selectors";

export function TaskCard({ task }: { task: TaskView }) {
  const { openTask } = useJoiner();
  return (
    <button type="button" onClick={() => openTask(task.id)} className={`${card} w-full p-4 text-left transition-colors hover:border-ink/15`}>
      <span className="flex items-start justify-between gap-3">
        <span className="font-medium leading-snug">{task.title}</span>
        <StatusPill task={task} />
      </span>
      <span className="mt-2 line-clamp-2 block text-sm leading-relaxed text-muted">{task.why}</span>
      <span className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink/70">
        <span className="font-medium">{task.dueLabel}</span>
        {task.with ? <span>With {task.with}</span> : null}
        {task.system ? <span>{task.system}</span> : null}
      </span>
    </button>
  );
}
