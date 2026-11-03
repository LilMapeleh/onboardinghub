import type { Health, MilestoneView, SignalStatus } from "@/lib/admin/types";

export function healthLabel(health: Health): string {
  if (health === "blocked") return "Blocked";
  if (health === "attention") return "Needs a look";
  return "On track";
}

export function statusLabel(status: SignalStatus): string {
  return {
    done: "Done",
    upcoming: "Later",
    open: "To do",
    in_progress: "In progress",
    waiting: "On its way",
    overdue: "Overdue",
    blocked: "Blocked",
  }[status];
}

export function milestoneLabel(status: MilestoneView["status"]): string {
  return {
    done: "Done",
    upcoming: "Later",
    now: "In progress",
    due: "Due now",
    overdue: "Overdue",
    blocked: "Blocked",
  }[status];
}

export function dayPhrase(day: number): string {
  if (day < 1) {
    const until = 1 - day;
    return until === 1 ? "Starts tomorrow" : `Starts in ${until} days`;
  }
  if (day > 90) return "Journey closed";
  return `Day ${day} of 90`;
}

export function progressWidth(day: number): number {
  if (day <= 0) return 0;
  if (day >= 90) return 100;
  return (day / 90) * 100;
}
