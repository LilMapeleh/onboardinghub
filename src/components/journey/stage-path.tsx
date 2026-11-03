"use client";

import { journeyStages } from "@/lib/selectors";
import { Icon } from "@/components/ui/icon";

export function StagePath({ day }: { day: number }) {
  const stages = journeyStages();
  return (
    <ol className="grid min-w-[520px] grid-cols-5 gap-1 sm:min-w-0">
      {stages.map((stage, index) => {
        const state = day > stage.toDay ? "done" : day >= stage.fromDay && day >= 1 ? "current" : "upcoming";
        const connected = index > 0 && day > stages[index - 1].toDay;
        return (
          <li key={stage.id} className="relative flex flex-col items-center text-center">
            {index > 0 ? (
              <span
                className={`absolute right-1/2 top-[15px] h-px w-full ${connected ? "bg-pine" : "bg-line"}`}
              />
            ) : null}
            <span
              className={`relative z-10 grid h-8 w-8 place-items-center rounded-full border ${
                state === "done"
                  ? "border-pine bg-pine text-white"
                  : state === "current"
                    ? "border-red bg-card text-red"
                    : "border-line bg-paper text-muted"
              }`}
            >
              {state === "done" ? <Icon name="check" className="h-4 w-4" /> : <span className="h-1.5 w-1.5 rounded-full bg-current" />}
            </span>
            <span className={`mt-3 text-[11px] font-medium leading-tight ${state === "upcoming" ? "text-muted" : "text-ink"}`}>
              {stage.short}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
