"use client";

import { useState } from "react";
import { useJoiner } from "@/components/joiner/joiner-context";
import { TaskCard } from "@/components/tasks/task-card";
import { Icon } from "@/components/ui/icon";
import { PageIntro, card } from "@/components/ui/primitives";
import { stages } from "@/lib/content";
import { formatLong, dateForDay } from "@/lib/dates";
import type { Stage, StageId } from "@/lib/types";

export function JourneyView() {
  const { stage } = useJoiner();
  return <JourneyBody key={stage.id} />;
}

function JourneyBody() {
  const { day, stage, tasks, badges, articles, openArticle } = useJoiner();
  const [selectedId, setSelectedId] = useState<StageId>(stage.id);

  const selected = stages.find((item) => item.id === selectedId) ?? stage;
  const stageTasks = tasks.filter((task) => task.stageId === selected.id);
  const done = stageTasks.filter((task) => task.status === "completed").length;
  const article = articles.find((item) => item.category === "stage" && item.stageId === selected.id);
  const state = day > selected.toDay ? "Complete" : day >= selected.fromDay ? "Now" : "Coming up";

  return (
    <div>
      <PageIntro
        eyebrow="My journey"
        title="The first 90 days."
        lede="Five stages, from your first morning to the Day 90 review. Open any stage to see what it is for, what your manager is doing, and what is yours."
      />
      <div className="grid items-start gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
        <ol className="flex gap-2 overflow-x-auto lg:flex-col">
          {stages.map((item) => {
            const itemState = day > item.toDay ? "done" : day >= item.fromDay ? "now" : "later";
            const current = item.id === selected.id;
            return (
              <li key={item.id} className="shrink-0 lg:shrink">
                <button
                  type="button"
                  onClick={() => setSelectedId(item.id)}
                  aria-current={current ? "true" : undefined}
                  className={`w-full rounded-2xl px-3 py-3 text-left ${
                    current ? "bg-pine text-white" : "bg-card text-ink ring-1 ring-line"
                  }`}
                >
                  <span className="flex items-center justify-between gap-3">
                    <span className="text-sm font-medium">{item.name}</span>
                    {itemState === "done" ? <Icon name="check" className="h-4 w-4" /> : null}
                  </span>
                  <span className={`mt-1 block text-xs ${current ? "text-white/65" : "text-muted"}`}>
                    {item.inJourney ? item.short : "Before day one"}
                    {itemState === "now" ? " · now" : ""}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
        <StageDetail
          stage={selected}
          state={state}
          done={done}
          total={stageTasks.length}
          onRead={article ? () => openArticle(article.id) : undefined}
          articleTitle={article?.title}
        >
          <div className="space-y-3">
            {stageTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </StageDetail>
      </div>
      <section className="mt-12">
        <h2 className="font-display text-3xl">Badges</h2>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
          They mark the moments, and they stay light. Compliance is still compliance. A badge does not change that.
        </p>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {badges.map((badge) => (
            <li key={badge.id} className={`${card} p-4 ${badge.earned ? "" : "opacity-70"}`}>
              <span
                className={`grid h-10 w-10 place-items-center rounded-full ${
                  badge.earned ? "bg-gold-soft text-gold" : "border border-dashed border-line text-muted"
                }`}
              >
                {badge.earned ? <Icon name="check" className="h-4 w-4" /> : <span className="h-1.5 w-1.5 rounded-full bg-current" />}
              </span>
              <p className="mt-3 font-medium">{badge.name}</p>
              <p className="mt-1 text-sm leading-relaxed text-muted">{badge.description}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function StageDetail({
  stage,
  state,
  done,
  total,
  onRead,
  articleTitle,
  children,
}: {
  stage: Stage;
  state: string;
  done: number;
  total: number;
  onRead?: () => void;
  articleTitle?: string;
  children: React.ReactNode;
}) {
  return (
    <article className={`${card} p-5 sm:p-7`}>
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-red">{state}</p>
      <h2 className="mt-2 font-display text-4xl leading-tight">{stage.name}</h2>
      <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted">{stage.objective}</p>
      <p className="mt-3 text-sm text-muted">
        {stage.fromDay < 1
          ? `Before ${formatLong(dateForDay(1))}`
          : stage.fromDay === stage.toDay
            ? formatLong(dateForDay(stage.fromDay))
            : `${formatLong(dateForDay(stage.fromDay))} – ${formatLong(dateForDay(stage.toDay))}`}
      </p>
      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <div>
          <h3 className="text-sm font-medium">What matters</h3>
          <ul className="mt-2 space-y-2 text-sm leading-relaxed text-muted">
            {stage.matters.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-medium">Your manager</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted">{stage.manager}</p>
          <p className="mt-4 text-sm font-medium">
            {done} of {total} done
          </p>
        </div>
      </div>
      {onRead && articleTitle ? (
        <button type="button" onClick={onRead} className="mt-5 text-sm font-medium underline decoration-ink/20 underline-offset-4">
          Read “{articleTitle}”
        </button>
      ) : null}
      <div className="mt-6">{children}</div>
    </article>
  );
}
