"use client";

import Link from "next/link";
import { useJoiner } from "@/components/joiner/joiner-context";
import { Icon } from "@/components/ui/icon";
import { card } from "@/components/ui/primitives";
import type { EventView, TaskView } from "@/lib/selectors";
import { priority } from "@/lib/selectors";

const STOPS = ["Pre-boarding", "1st Week", "1st Month", "2nd Month", "3rd Month"] as const;

function stopIndex(day: number): number {
  if (day < 1) return 0;
  if (day <= 7) return 1;
  if (day <= 30) return 2;
  if (day <= 60) return 3;
  return 4;
}

function duePhrase(task: TaskView, day: number): string {
  if (task.status === "waiting") return task.dueLabel;
  if (task.dueOnDay === day) return "Due today";
  if (task.dueOnDay - day === 1) return "Due tomorrow";
  if (task.dueOnDay > day) return `Due in ${task.dueOnDay - day} days`;
  return task.dueLabel;
}

export function HomeView() {
  const joiner = useJoiner();
  const { employee, day, tasks, schedule, articles, people, badges, stage, eventWhen, openTask, openArticle, query } =
    joiner;
  const index = stopIndex(day);
  const open = tasks
    .filter((task) => task.status !== "completed" && task.status !== "locked")
    .sort((a, b) => priority(a) - priority(b) || a.dueOnDay - b.dueOnDay);
  const needle = query.trim().toLowerCase();
  const matched = needle
    ? open.filter((task) => `${task.title} ${task.why}`.toLowerCase().includes(needle))
    : open;
  const listed = matched.slice(0, needle ? 6 : 3);
  const next = schedule
    .filter((event) => event.day >= day)
    .sort((a, b) => a.day - b.day || a.start.localeCompare(b.start))[0];
  const article = articles.find((item) => item.category === "stage" && item.stageId === stage.id);
  const priya = people.find((person) => person.id === "priya");
  const quote = day < 8 && priya?.note ? priya.note : stage.note;
  const quoteBy = day < 8 ? "Priya Nair · Manager" : stage.name;
  const earned = badges.filter((badge) => badge.earned).length;
  const nextBadge = badges.find((badge) => !badge.earned);

  return (
    <div className="min-w-0">
      <h1 className="text-[1.7rem] font-semibold tracking-tight text-ink">Onboarding Plan</h1>
      <p className="mt-3 max-w-3xl text-[15px] leading-relaxed text-ink">
        Welcome to Sitecore!
        <span className="mt-1 block text-muted">
          We have a lot of interesting content to share with you and look forward to giving you a great start in your new
          role.
        </span>
      </p>

      <section className={`${card} mt-6 px-5 py-5 sm:px-7`}>
        <h2 className="text-lg font-semibold text-ink">{STOPS[index]}</h2>
        <p className="mt-1 text-sm text-muted">Here is your Onboarding timeline.</p>
        <Timeline index={index} />
      </section>

      <div className="mt-6 grid min-w-0 items-start gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(260px,0.72fr)]">
        <section className="min-w-0">
          <div className="mb-3 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-[1.65rem] font-semibold tracking-tight text-ink">To Do</h2>
              <p className="mt-1 text-sm font-semibold text-ink">
                {matched.length} {matched.length === 1 ? "Task" : "Tasks"}
              </p>
            </div>
            <Link href="/tasks" className="text-sm font-medium text-violet hover:underline">
              View all tasks
            </Link>
          </div>
          <div className={`${card} overflow-hidden`}>
            {listed.length === 0 ? (
              <p className="px-5 py-8 text-sm leading-relaxed text-muted">
                {needle
                  ? `Nothing open matches “${query.trim()}”.`
                  : "You are clear for the moment. The next part of the journey will open here when it is time."}
              </p>
            ) : (
              <ul>
                {listed.map((task) => (
                  <li key={task.id} className="border-t border-line first:border-t-0">
                    <button
                      type="button"
                      onClick={() => openTask(task.id)}
                      className="flex w-full items-center gap-4 px-4 py-4 text-left hover:bg-paper sm:px-5"
                    >
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-[#EEE9FF] text-violet">
                        <Icon name="doc" className="h-5 w-5" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-medium text-ink">{task.title}</span>
                        <span className="mt-0.5 block truncate text-sm text-muted">{task.why}</span>
                        <span className={`mt-0.5 block text-sm font-medium ${task.overdue ? "text-rust" : "text-gold"}`}>
                          {duePhrase(task, day)}
                        </span>
                      </span>
                      <Icon name="arrow" className="h-4 w-4 shrink-0 text-muted" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        <aside className="min-w-0 space-y-5">
          <section>
            <h2 className="text-lg font-semibold text-ink">Highlights</h2>
            <figure className="mt-3 rounded-2xl border border-[#C9B8FF] bg-white p-4 shadow-[0_10px_30px_-24px_rgba(92,45,255,0.7)]">
              <div className="mb-3 h-16 overflow-hidden rounded-xl bg-gradient-to-br from-[#5C2DFF] via-[#E23886] to-[#FF2A3A]" />
              <blockquote className="text-sm leading-relaxed text-ink">“{quote}”</blockquote>
              <figcaption className="mt-3 text-xs text-muted">{quoteBy}</figcaption>
            </figure>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-ink">Announcements</h2>
            <div className="mt-3 space-y-3">
              {next ? <Announcement event={next} when={eventWhen(next)} /> : null}
              {article ? (
                <button
                  type="button"
                  onClick={() => openArticle(article.id)}
                  className={`${card} block w-full p-4 text-left hover:bg-paper`}
                >
                  <p className="font-semibold text-ink">{article.title}</p>
                  <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-muted">{article.summary}</p>
                </button>
              ) : null}
              <div className={`${card} p-4`}>
                <p className="font-semibold text-ink">
                  {earned} of {badges.length} badges
                </p>
                <p className="mt-1 text-sm leading-relaxed text-muted">
                  {nextBadge ? `Next is ${nextBadge.name}. ${employee.firstName}, you are on ${STOPS[index]}.` : "You have the full set."}
                </p>
                {nextBadge ? (
                  <button type="button" className="mt-2 text-sm font-medium text-violet" onClick={() => openTask(nextBadge.taskId)}>
                    Continue
                  </button>
                ) : null}
              </div>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}

function Timeline({ index }: { index: number }) {
  const fill = (index / (STOPS.length - 1)) * 80;
  return (
    <div className="relative mt-8">
      <div className="absolute left-[10%] right-[10%] top-[9px] h-[3px] rounded-full bg-paper-deep" />
      <div
        className="absolute left-[10%] top-[9px] h-[3px] rounded-full bg-gradient-to-r from-[#5C2DFF] via-[#E23886] to-[#FF2A3A]"
        style={{ width: `${fill}%` }}
      />
      <ol className="relative grid grid-cols-5">
        {STOPS.map((label, position) => {
          const current = position === index;
          const done = position < index;
          return (
            <li key={label} className="flex justify-center">
              <span
                className={`grid h-5 w-5 place-items-center rounded-full border-2 ${
                  current
                    ? "border-white bg-[#5C2DFF] shadow-[0_0_0_4px_rgba(92,45,255,0.18)]"
                    : done
                      ? "border-[#5C2DFF] bg-[#5C2DFF]"
                      : "border-[#D5D8E0] bg-white"
                }`}
              />
            </li>
          );
        })}
      </ol>
      <ol className="mt-3 grid grid-cols-5 text-center">
        {STOPS.map((label, position) => (
          <li
            key={label}
            className={`whitespace-nowrap px-0.5 text-[9px] leading-tight sm:text-xs ${position === index ? "font-semibold text-ink" : "text-muted"}`}
          >
            {label}
          </li>
        ))}
      </ol>
    </div>
  );
}

function Announcement({ event, when }: { event: EventView; when: string }) {
  return (
    <Link href="/calendar" className={`${card} block p-4 hover:bg-paper`}>
      <p className="font-semibold text-ink">{event.title}</p>
      <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-muted">
        {when} · {event.who}. {event.detail}
      </p>
    </Link>
  );
}
