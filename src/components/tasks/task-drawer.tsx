"use client";

import { useEffect, useRef } from "react";
import { cultureChoices } from "@/lib/content";
import { useJoiner } from "@/components/joiner/joiner-context";
import { Button, StatusPill } from "@/components/ui/primitives";
import { Icon } from "@/components/ui/icon";
import { formatLong } from "@/lib/dates";

export function TaskDrawer() {
  const joiner = useJoiner();
  const closeRef = useRef<HTMLButtonElement>(null);
  const task = joiner.tasks.find((item) => item.id === joiner.openTaskId);
  const { openTask, openTaskId } = joiner;

  useEffect(() => {
    if (!openTaskId) return;
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") openTask(null);
    };
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [openTaskId, openTask]);

  if (!task) return null;

  const cultureDone = task.id === "culture" && task.status === "completed";
  const showCulture = task.id === "culture" && task.status !== "locked" && !cultureDone;

  return (
    <div className="fixed inset-0 z-40 flex justify-end bg-ink/35" onClick={() => joiner.openTask(null)}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-title"
        className="flex h-full w-full max-w-md flex-col bg-card shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-line px-5 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-red">Your task</p>
            <h2 id="task-title" className="mt-1 font-display text-3xl leading-tight">
              {task.title}
            </h2>
          </div>
          <button
            ref={closeRef}
            type="button"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-line"
            aria-label="Close"
            onClick={() => joiner.openTask(null)}
          >
            <Icon name="close" className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-5">
          <StatusPill task={task} />
          <p className="mt-4 text-sm leading-relaxed text-muted">{task.why}</p>
          <ol className="mt-5 space-y-3">
            {task.steps.map((step, index) => (
              <li key={step} className="flex gap-3 text-sm leading-relaxed">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-paper-deep text-xs font-medium">
                  {index + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
          <dl className="mt-6 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-2xl bg-paper p-3">
              <dt className="text-xs text-muted">Due</dt>
              <dd className="mt-1 font-medium">{formatLong(task.dueDate)}</dd>
            </div>
            <div className="rounded-2xl bg-paper p-3">
              <dt className="text-xs text-muted">With</dt>
              <dd className="mt-1 font-medium">{task.with ?? "You"}</dd>
            </div>
          </dl>
          {task.status === "waiting" && task.waitingNote ? (
            <p className="mt-4 rounded-2xl bg-gold-soft px-4 py-3 text-sm leading-relaxed text-gold">{task.waitingNote}</p>
          ) : null}
          {task.status === "locked" ? (
            <p className="mt-4 rounded-2xl bg-paper px-4 py-3 text-sm leading-relaxed text-muted">
              This opens on {formatLong(task.openDate)}. It will appear in Now when it is time.
            </p>
          ) : null}
          {task.next ? <p className="mt-4 text-sm leading-relaxed text-muted">Next: {task.next}</p> : null}
          {showCulture ? <CultureForm /> : null}
          {cultureDone ? (
            <p className="mt-4 rounded-2xl bg-gold-soft px-4 py-3 text-sm text-gold">
              Culture Explorer is yours. It sits with your other badges on the journey.
            </p>
          ) : null}
          {task.articleId ? (
            <button
              type="button"
              className="mt-4 text-sm font-medium text-pine underline decoration-pine/30 underline-offset-4"
              onClick={() => joiner.openArticle(task.articleId ?? null)}
            >
              Read the short version in the Hub
            </button>
          ) : null}
        </div>
        {task.id !== "culture" || task.status === "locked" || task.status === "completed" ? (
          <div className="flex flex-wrap gap-2 border-t border-line px-5 py-4">
            {task.system && task.status !== "locked" ? (
              <Button onClick={() => joiner.showExternal(task.system ?? "")}>Open in {task.system}</Button>
            ) : null}
            {task.status === "not_started" ? (
              <Button variant="quiet" onClick={() => joiner.setTaskStatus(task.id, "in_progress")}>
                Start
              </Button>
            ) : null}
            {task.status === "not_started" || task.status === "in_progress" ? (
              <Button
                variant={task.system ? "quiet" : "primary"}
                onClick={() => joiner.setTaskStatus(task.id, "completed")}
              >
                I&apos;ve done this
              </Button>
            ) : null}
            {task.status === "completed" ? (
              <Button variant="quiet" onClick={() => joiner.setTaskStatus(task.id, "not_started")}>
                Reopen
              </Button>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function CultureForm() {
  const { culture, setCulture, cultureError, submitCulture } = useJoiner();
  return (
    <form
      className="mt-6 space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        submitCulture();
      }}
    >
      <fieldset>
        <legend className="text-sm font-medium">Customers come to Sitecore mainly to…</legend>
        <div className="mt-2 space-y-2">
          {cultureChoices.map((choice) => (
            <label key={choice.id} className="flex cursor-pointer gap-3 rounded-2xl border border-line px-3 py-3 text-sm">
              <input
                type="radio"
                name="customers"
                value={choice.id}
                checked={culture.choice === choice.id}
                onChange={() => setCulture({ ...culture, choice: choice.id })}
              />
              <span>{choice.label}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <label className="block text-sm font-medium">
        Who can you ask for help this week, and what would you ask?
        <textarea
          value={culture.help}
          onChange={(event) => setCulture({ ...culture, help: event.target.value })}
          rows={3}
          className="mt-2 w-full rounded-2xl border border-line bg-paper px-3 py-2 font-normal"
          placeholder="A sentence is enough."
        />
      </label>
      <label className="block text-sm font-medium">
        What do you want to be able to explain about your role by Day 30?
        <textarea
          value={culture.hope}
          onChange={(event) => setCulture({ ...culture, hope: event.target.value })}
          rows={3}
          className="mt-2 w-full rounded-2xl border border-line bg-paper px-3 py-2 font-normal"
          placeholder="A sentence is enough."
        />
      </label>
      {cultureError ? <p className="text-sm text-rust">{cultureError}</p> : null}
      <Button onClick={submitCulture}>Finish the activity</Button>
    </form>
  );
}
