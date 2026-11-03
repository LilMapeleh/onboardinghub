import Link from "next/link";
import { dayPhrase, milestoneLabel, progressWidth, statusLabel } from "@/lib/admin/copy";
import { formatDayMonth, formatLong, formatMedium } from "@/lib/admin/dates";
import type { JoinerView, SignalView } from "@/lib/admin/types";
import { Avatar, HealthPill, LiveMark, MilestonePill, StatusPill, card } from "@/components/admin/ui/primitives";

export function Dossier({ joiner, mode }: { joiner: JoinerView; mode: "panel" | "full" }) {
  const active = joiner.signals.filter((signal) => signal.status !== "done" && signal.status !== "upcoming");
  const upcoming = joiner.signals.filter((signal) => signal.status === "upcoming");
  const done = joiner.signals.filter((signal) => signal.status === "done");
  const hot = active.filter(
    (signal) =>
      signal.status === "blocked" ||
      signal.status === "overdue" ||
      ((signal.status === "open" || signal.status === "in_progress") && signal.dueOnDay <= joiner.day),
  );
  const shown = mode === "panel" ? active.slice(0, 4) : active;

  return (
    <article className={mode === "panel" ? `${card} p-5` : "space-y-6"}>
      {mode === "full" ? (
        <Link href={`/admin?phase=${joiner.phase.id}&focus=${joiner.id}`} className="text-sm font-medium text-violet hover:underline">
          Back to the lifecycle
        </Link>
      ) : null}

      <header className={mode === "full" ? `${card} p-5 sm:p-6` : ""}>
        <div className="flex items-start gap-4">
          <Avatar initials={joiner.initials} tone={joiner.tone} size={mode === "full" ? "lg" : "md"} />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className={`font-display leading-tight text-ink ${mode === "full" ? "text-4xl" : "text-2xl"}`}>{joiner.name}</h2>
              {joiner.live ? <LiveMark /> : null}
            </div>
            <p className="mt-1 text-sm text-muted">
              {joiner.role} · {joiner.team}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <HealthPill health={joiner.health} />
              <span className="text-sm font-medium text-ink">{dayPhrase(joiner.day)}</span>
              <span className="text-sm text-muted">{joiner.phase.label}</span>
            </div>
          </div>
        </div>

        {joiner.live ? (
          <p className="mt-4 rounded-2xl bg-[#F7F4FF] px-4 py-3 text-sm leading-relaxed text-ink">
            This is the live Onboarding Hub profile. Her day, stage and open tasks follow the same journey the Hub shows
            for {formatLong("2026-11-03")}.
          </p>
        ) : null}

        <JourneyBar joiner={joiner} />
        <ol className="mt-4 grid grid-cols-5 gap-1">
          {joiner.milestones.map((milestone) => (
            <li key={milestone.id} className="text-center">
              <MilestonePill status={milestone.status} />
              <span className="mt-1 block text-[11px] font-medium text-ink">{milestone.label}</span>
            </li>
          ))}
        </ol>
      </header>

      {mode === "full" && hot.length > 0 ? (
        <section className="rounded-2xl border border-rust/20 bg-rust-soft px-5 py-4">
          <h3 className="text-sm font-semibold text-rust">Needs someone now</h3>
          <ul className="mt-3 space-y-3">
            {hot.map((signal) => (
              <SignalRow key={signal.id} signal={signal} />
            ))}
          </ul>
        </section>
      ) : null}

      <section className={mode === "full" ? `${card} p-5` : "mt-5"}>
        <h3 className="text-sm font-semibold text-ink">{mode === "panel" ? "Open right now" : "Open work"}</h3>
        {shown.length === 0 ? (
          <p className="mt-3 text-sm leading-relaxed text-muted">
            {joiner.day > 90 ? "The 90 days are closed. Nothing is waiting in the Hub." : "Nothing is open in this stretch."}
          </p>
        ) : (
          <ul className="mt-3 divide-y divide-line">
            {shown.map((signal) => (
              <li key={signal.id} className="py-3 first:pt-0 last:pb-0">
                <SignalRow signal={signal} />
              </li>
            ))}
          </ul>
        )}
        {mode === "panel" ? (
          <Link href={`/admin/joiners/${joiner.id}`} className="mt-4 inline-flex text-sm font-medium text-violet hover:underline">
            Open the full record
          </Link>
        ) : null}
      </section>

      {mode === "full" ? (
        <>
          <section className={`${card} p-5`}>
            <h3 className="text-sm font-semibold text-ink">Coming up</h3>
            {upcoming.length === 0 ? (
              <p className="mt-3 text-sm text-muted">The remaining milestones are already open or done.</p>
            ) : (
              <ul className="mt-3 divide-y divide-line">
                {upcoming.slice(0, 5).map((signal) => (
                  <li key={signal.id} className="py-3 first:pt-0 last:pb-0">
                    <SignalRow signal={signal} />
                  </li>
                ))}
              </ul>
            )}
            {upcoming.length > 5 ? <p className="mt-3 text-xs text-muted">{upcoming.length - 5} more open later in the 90 days.</p> : null}
          </section>

          <section className={`${card} p-5`}>
            <h3 className="text-sm font-semibold text-ink">People around this joiner</h3>
            <dl className="mt-4 grid gap-3 sm:grid-cols-2">
              <PersonFact label="Hiring manager" value={joiner.manager} />
              <PersonFact label="Buddy" value={joiner.buddy} />
              <PersonFact label="HR Operations" value={joiner.support.hr} />
              <PersonFact label="IT" value={joiner.support.it} />
              <PersonFact label="Workplace" value={joiner.support.workplace} />
              <PersonFact label="Employee Experience" value={joiner.support.experience} />
            </dl>
          </section>

          <section className={`${card} p-5`}>
            <h3 className="text-sm font-semibold text-ink">Profile from the Onboarding Hub</h3>
            <dl className="mt-4 grid gap-3 sm:grid-cols-2">
              <PersonFact label="Department" value={joiner.department} />
              <PersonFact label="Team" value={joiner.team} />
              <PersonFact label="Location" value={`${joiner.location} · ${joiner.arrangement}`} />
              <PersonFact label="Cohort" value={`${joiner.cohort} · ${joiner.classKind}`} />
              <PersonFact label="Offer accepted" value={formatLong(joiner.offerAccepted)} />
              <PersonFact label="Start date" value={formatLong(joiner.startDate)} />
              <PersonFact label="Personal email" value={joiner.personalEmail} />
              <PersonFact label="Work email" value={joiner.workEmail} />
            </dl>
            <p className="mt-4 text-xs leading-relaxed text-muted">
              Preboarding mail uses the personal address. Immigration documents stay out of the Hub. A start-date risk, when there is one, is recorded as status only.
            </p>
          </section>

          <section className={`${card} p-5`}>
            <h3 className="text-sm font-semibold text-ink">Badges</h3>
            <ul className="mt-4 flex flex-wrap gap-2">
              {joiner.badges.map((badge) => (
                <li
                  key={badge.id}
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    badge.earned ? "bg-pine text-white" : "bg-paper-deep text-muted"
                  }`}
                >
                  {badge.name}
                </li>
              ))}
            </ul>
          </section>

          <details className={`${card} p-5`}>
            <summary className="cursor-pointer text-sm font-semibold text-ink">Completed · {done.length}</summary>
            <ul className="mt-3 divide-y divide-line">
              {done.map((signal) => (
                <li key={signal.id} className="py-3">
                  <SignalRow signal={signal} />
                </li>
              ))}
            </ul>
          </details>
        </>
      ) : null}
    </article>
  );
}

function JourneyBar({ joiner }: { joiner: JoinerView }) {
  const width = progressWidth(joiner.day);
  const marker = joiner.day < 1 ? 0 : Math.min(100, (Math.min(joiner.day, 90) / 90) * 100);
  const fill = joiner.health === "blocked" ? "bg-red" : joiner.health === "attention" ? "bg-gold" : "bg-violet";
  return (
    <div className="mt-5">
      <div className="relative h-2 rounded-full bg-paper-deep">
        <div className={`h-full rounded-full ${fill}`} style={{ width: `${width}%` }} />
        <span
          className="absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow"
          style={{ left: `${marker}%`, backgroundColor: joiner.tone }}
          aria-hidden
        />
      </div>
      <div className="mt-2 flex justify-between text-[10px] font-medium text-muted">
        <span>Day 1</span>
        <span>Day 30</span>
        <span>Day 60</span>
        <span>Day 90</span>
      </div>
      <p className="sr-only">
        {joiner.name} is at {dayPhrase(joiner.day)}. Started {formatDayMonth(joiner.startDate)}.
      </p>
    </div>
  );
}

function SignalRow({ signal }: { signal: SignalView }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <p className="text-sm font-medium text-ink">{signal.title}</p>
        <p className="mt-1 text-sm leading-relaxed text-muted">{signal.detail}</p>
        <p className="mt-1 text-xs text-muted">
          {signal.owner}
          {signal.system ? ` · ${signal.system}` : ""}
          {signal.expected ? ` · Expected ${formatMedium(signal.expected)}` : ""}
        </p>
      </div>
      <StatusPill status={signal.status} />
    </div>
  );
}

function PersonFact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">{label}</dt>
      <dd className="mt-1 text-sm text-ink">{value}</dd>
    </div>
  );
}

export function watchingLine(joiner: JoinerView): string {
  if (joiner.concern) return `${joiner.concern.label} · ${milestoneLabel(joiner.concern.status)}`;
  if (!joiner.next) return "Journey complete";
  return `${joiner.next.title} · ${statusLabel(joiner.next.status)}`;
}
