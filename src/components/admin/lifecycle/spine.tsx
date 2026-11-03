"use client";

import type { CSSProperties } from "react";
import { dayPhrase, healthLabel } from "@/lib/admin/copy";
import { bandFor, placement, type Lens } from "@/lib/admin/lifecycle";
import { phases } from "@/lib/admin/programme";
import type { JoinerView, PhaseId } from "@/lib/admin/types";

export function Spine({
  people,
  lens,
  focus,
  matching,
  onLens,
  onFocus,
}: {
  people: JoinerView[];
  lens: Lens;
  focus: string | null;
  matching: (joiner: JoinerView) => boolean;
  onLens: (lens: Lens) => void;
  onFocus: (joiner: JoinerView) => void;
}) {
  const spots = placement(people);
  const soon = people.filter((joiner) => joiner.day < 1);
  const closed = people.filter((joiner) => joiner.day > 90);
  const onTrack = people.filter((joiner) => joiner.day >= 1 && joiner.day <= 90);
  const band = lens !== "journey" && lens !== "all" ? bandFor(lens) : null;
  const focused = people.find((joiner) => joiner.id === focus) ?? null;

  return (
    <section className="rounded-2xl border border-line bg-card px-4 py-5 shadow-[0_1px_2px_rgba(28,28,40,0.04),0_12px_32px_-24px_rgba(42,20,104,0.35)] sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-ink">First 90 days</h2>
          <p className="mt-1 text-sm text-muted">Each person sits on the day they are in. Select a moment, then a joiner.</p>
        </div>
        <ul className="flex flex-wrap gap-3 text-[11px] font-medium text-muted">
          <li className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-violet" /> On track
          </li>
          <li className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-gold" /> Needs a look
          </li>
          <li className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-red" /> Blocked
          </li>
        </ul>
      </div>

      <div className="mt-5 overflow-x-auto pb-1">
        <div className="min-w-[760px]">
          <div className="grid grid-cols-[7.5rem_minmax(0,1fr)_7.5rem] items-stretch gap-3">
            <Pocket
              label="Starting soon"
              count={soon.length}
              active={lens === "soon"}
              faded={lens !== "all" && lens !== "soon"}
              people={soon}
              focus={focus}
              matching={matching}
              onOpen={() => onLens("soon")}
              onFocus={onFocus}
            />
            <div>
              <div className="relative mx-3 mr-8 h-28">
                <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-line" />
                {band ? (
                  <div
                    className="absolute top-1/2 h-8 -translate-y-1/2 rounded-full bg-[#EEE9FF]"
                    style={{ left: `${band.left}%`, width: `${band.width}%` }}
                  />
                ) : null}
                {onTrack.map((joiner) => {
                  const spot = spots.get(joiner.id);
                  if (!spot) return null;
                  const dim = lens === "soon" || lens === "closed" || !matching(joiner) || (lens !== "journey" && lens !== "all" && joiner.phase.id !== lens);
                  return (
                    <PersonToken
                      key={joiner.id}
                      joiner={joiner}
                      pressed={focus === joiner.id}
                      dim={dim}
                      placed
                      style={{ left: `${spot.left}%`, transform: `translate(-50%, calc(-50% + ${spot.offset}px))` }}
                      onFocus={onFocus}
                    />
                  );
                })}
              </div>
              <div className="relative mx-3 mr-8 mt-1 h-4 text-[10px] font-medium text-muted">
                {[
                  [1, "Day 1"],
                  [30, "Day 30"],
                  [60, "Day 60"],
                  [90, "Day 90"],
                ].map(([day, label]) => (
                  <span
                    key={String(day)}
                    className="absolute -translate-x-1/2"
                    style={{ left: `${((Number(day) - 1) / 89) * 100}%` }}
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>
            <Pocket
              label="Closed"
              count={closed.length}
              active={lens === "closed"}
              faded={lens !== "all" && lens !== "closed"}
              people={closed}
              focus={focus}
              matching={matching}
              onOpen={() => onLens("closed")}
              onFocus={onFocus}
            />
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2" role="tablist" aria-label="Moments in the journey">
        <LensTab label="90 days" count={people.filter((joiner) => joiner.day >= 1 && joiner.day <= 90 && matching(joiner)).length} selected={lens === "journey"} onClick={() => onLens("journey")} />
        <LensTab label="All" count={people.filter(matching).length} selected={lens === "all"} onClick={() => onLens("all")} />
        {phases.map((phase) => (
          <LensTab
            key={phase.id}
            label={phase.short}
            count={people.filter((joiner) => joiner.phase.id === phase.id && matching(joiner)).length}
            selected={lens === phase.id}
            onClick={() => onLens(phase.id)}
          />
        ))}
      </div>

      <p className="mt-4 text-sm text-ink" aria-live="polite">
        {focused
          ? `${focused.name} · ${dayPhrase(focused.day)} · ${focused.phase.label} · ${healthLabel(focused.health)}`
          : "Select a person on the journey to open their record beside the list."}
      </p>
    </section>
  );
}

function LensTab({
  label,
  count,
  selected,
  onClick,
}: {
  label: string;
  count: number;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={selected}
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm ${
        selected ? "bg-pine text-white" : "border border-line bg-card text-ink hover:bg-paper"
      }`}
    >
      {label}
      <span className={selected ? "text-white/70" : "text-muted"}>{count}</span>
    </button>
  );
}

function Pocket({
  label,
  count,
  active,
  people,
  focus,
  matching,
  faded,
  onOpen,
  onFocus,
}: {
  label: string;
  count: number;
  active: boolean;
  faded: boolean;
  people: JoinerView[];
  focus: string | null;
  matching: (joiner: JoinerView) => boolean;
  onOpen: () => void;
  onFocus: (joiner: JoinerView) => void;
}) {
  return (
    <div className={`flex flex-col rounded-2xl border px-3 py-3 ${active ? "border-violet bg-[#F7F4FF]" : "border-line bg-paper"}`}>
      <button type="button" onClick={onOpen} className="text-left">
        <span className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">{label}</span>
        <span className="mt-0.5 block text-sm font-medium text-ink">
          {count} {count === 1 ? "person" : "people"}
        </span>
      </button>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {people.map((joiner) => (
          <PersonToken
            key={joiner.id}
            joiner={joiner}
            pressed={focus === joiner.id}
            dim={faded || !matching(joiner)}
            onFocus={onFocus}
          />
        ))}
      </div>
    </div>
  );
}

function PersonToken({
  joiner,
  pressed,
  dim,
  placed = false,
  style,
  onFocus,
}: {
  joiner: JoinerView;
  pressed: boolean;
  dim: boolean;
  placed?: boolean;
  style?: CSSProperties;
  onFocus: (joiner: JoinerView) => void;
}) {
  const ring =
    joiner.health === "blocked" ? "ring-red" : joiner.health === "attention" ? "ring-gold" : "ring-white";
  return (
    <button
      type="button"
      className={`${placed ? "absolute top-1/2" : "relative"} z-10 grid h-9 w-9 place-items-center rounded-full text-[11px] font-semibold text-white ring-2 ${ring} ${
        pressed ? "z-20 ring-violet ring-offset-2" : ""
      } ${dim ? "opacity-35" : ""}`}
      style={{ backgroundColor: joiner.tone, ...style }}
      aria-pressed={pressed}
      aria-label={`${joiner.name}, ${dayPhrase(joiner.day)}, ${healthLabel(joiner.health)}`}
      title={`${joiner.name} · ${dayPhrase(joiner.day)}`}
      onClick={() => onFocus(joiner)}
    >
      {joiner.initials}
      {joiner.live ? <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border border-white bg-red" /> : null}
    </button>
  );
}

export function isPhase(lens: Lens): lens is PhaseId {
  return phases.some((phase) => phase.id === lens);
}
