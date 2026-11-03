import { badges, events, stages, tasks } from "@/lib/content";
import { dateForDay, formatMedium } from "@/lib/dates";
import type { Stage, Task, TaskStatus } from "@/lib/types";

export type Overrides = Partial<Record<string, TaskStatus>>;

export interface TaskView extends Task {
  status: TaskStatus | "locked";
  overdue: boolean;
  dueLabel: string;
  openDate: string;
  dueDate: string;
}

export interface EventView {
  id: string;
  title: string;
  day: number;
  date: string;
  start: string;
  end: string;
  who: string;
  where: string;
  detail: string;
  kind: (typeof events)[number]["kind"];
  when: string;
}

export interface BadgeView {
  id: string;
  name: string;
  description: string;
  earned: boolean;
  taskId: string;
}

export interface Notice {
  id: string;
  title: string;
  body: string;
  taskId?: string;
  href?: string;
}

export function stageForDay(day: number): Stage {
  const match = stages.find((stage) => day >= stage.fromDay && day <= stage.toDay);
  if (match) return match;
  if (day > 90) return stages[stages.length - 1];
  return stages[0];
}

export function resolveStatus(task: Task, day: number, overrides: Overrides): TaskStatus | "locked" {
  if (day < task.opensOnDay) return "locked";
  const override = overrides[task.id];
  if (override) return override;
  if (day > task.completesOnDay) return "completed";
  if (task.waitingUntilDay != null && day <= task.waitingUntilDay) return "waiting";
  if (task.inProgressFromDay != null && day >= task.inProgressFromDay) return "in_progress";
  return "not_started";
}

function dueLabel(task: Task, day: number, status: TaskStatus | "locked"): string {
  if (status === "completed") return "Done";
  if (status === "locked") return `Opens ${formatMedium(dateForDay(task.opensOnDay))}`;
  if (status === "waiting") return task.waitingNote ?? "Being arranged";
  if (day === task.dueOnDay) return "Due today";
  if (day > task.dueOnDay) return `Overdue · ${formatMedium(dateForDay(task.dueOnDay))}`;
  if (task.dueOnDay - day === 1) return "Due tomorrow";
  return `Due ${formatMedium(dateForDay(task.dueOnDay))}`;
}

export function taskViews(day: number, overrides: Overrides): TaskView[] {
  return tasks.map((task) => {
    const status = resolveStatus(task, day, overrides);
    return {
      ...task,
      status,
      overdue: status !== "completed" && status !== "locked" && status !== "waiting" && day > task.dueOnDay,
      dueLabel: dueLabel(task, day, status),
      openDate: dateForDay(task.opensOnDay),
      dueDate: dateForDay(task.dueOnDay),
    };
  });
}

export function eventViews(): EventView[] {
  return events.map((event) => {
    const date = dateForDay(event.day);
    return {
      ...event,
      date,
      when: event.day === 0 ? formatMedium(date) : `${formatMedium(date)} · ${event.start}`,
    };
  });
}

export function eventWhen(event: EventView, day: number): string {
  if (event.day === day) return `Today · ${event.start}`;
  if (event.day === day + 1) return `Tomorrow · ${event.start}`;
  return `${formatMedium(event.date)} · ${event.start}`;
}

export function badgeViews(day: number, overrides: Overrides): BadgeView[] {
  const views = taskViews(day, overrides);
  const done = new Set(views.filter((task) => task.status === "completed").map((task) => task.id));
  return badges.map((badge) => ({
    id: badge.id,
    name: badge.name,
    description: badge.description,
    earned: badge.requires.every((id) => done.has(id)),
    taskId: badge.requires.find((id) => !done.has(id)) ?? badge.requires[0],
  }));
}

export function earnedKey(day: number, overrides: Overrides): string {
  return badgeViews(day, overrides)
    .filter((badge) => badge.earned)
    .map((badge) => badge.id)
    .join("|");
}

export function notices(day: number, views: TaskView[], schedule: EventView[]): Notice[] {
  const items: Notice[] = [];
  for (const event of schedule.filter((item) => item.day === day)) {
    items.push({
      id: `event-${event.id}`,
      title: event.title,
      body: `Today at ${event.start} · ${event.who}`,
      href: "/calendar",
    });
  }
  for (const task of views) {
    if (task.status === "locked" || task.status === "completed") continue;
    if (task.overdue) {
      items.push({ id: `overdue-${task.id}`, title: task.title, body: task.dueLabel, taskId: task.id });
    } else if (task.status === "waiting") {
      items.push({
        id: `wait-${task.id}`,
        title: task.title,
        body: task.waitingNote ?? "Being arranged for you",
        taskId: task.id,
      });
    } else if (task.dueOnDay - day <= 2) {
      items.push({ id: `due-${task.id}`, title: task.title, body: task.dueLabel, taskId: task.id });
    }
  }
  return items;
}

export function priority(task: TaskView): number {
  if (task.overdue) return 0;
  if (task.status === "waiting") return 1;
  if (task.status === "in_progress") return 2;
  return 3;
}

export function journeyStages(): Stage[] {
  return stages.filter((stage) => stage.inJourney);
}
