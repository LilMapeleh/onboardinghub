"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Dossier, watchingLine } from "@/components/admin/joiner/dossier";
import { isPhase, Spine } from "@/components/admin/lifecycle/spine";
import { Avatar, HealthPill, LiveMark, PageIntro, card } from "@/components/admin/ui/primitives";
import { dayPhrase } from "@/lib/admin/copy";
import { formatLong } from "@/lib/admin/dates";
import { inLens, parseLens, phaseById, reviewDate, roster } from "@/lib/admin/lifecycle";
import type { Health, JoinerView } from "@/lib/admin/types";

const healthOrder: Record<Health, number> = { blocked: 0, attention: 1, on_track: 2 };

export function LifecycleHub() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const lens = parseLens(searchParams.get("phase"));
  const health = (searchParams.get("health") as Health | "all" | null) ?? "all";
  const location = searchParams.get("location") ?? "all";
  const focus = searchParams.get("focus");
  const [query, setQuery] = useState("");

  const locations = useMemo(() => [...new Set(roster.map((joiner) => joiner.location))].sort(), []);

  function matches(joiner: JoinerView): boolean {
    if ((health === "blocked" || health === "attention" || health === "on_track") && joiner.health !== health) return false;
    if (location !== "all" && joiner.location !== location) return false;
    const needle = query.trim().toLowerCase();
    if (!needle) return true;
    const haystack = `${joiner.name} ${joiner.role} ${joiner.team} ${joiner.location} ${joiner.manager} ${joiner.buddy} ${joiner.cohort}`.toLowerCase();
    return haystack.includes(needle);
  }

  function write(patch: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(patch)) {
      if (value === null || value === "") params.delete(key);
      else params.set(key, value);
    }
    if ((params.get("phase") ?? "journey") === "journey") params.delete("phase");
    if ((params.get("health") ?? "all") === "all") params.delete("health");
    if ((params.get("location") ?? "all") === "all") params.delete("location");
    const next = params.toString();
    router.replace(next ? `/admin?${next}` : "/admin", { scroll: false });
  }

  function select(joiner: JoinerView) {
    write({ focus: joiner.id, phase: joiner.phase.id });
  }

  useEffect(() => {
    if (!focus) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const wide = window.matchMedia("(min-width: 1280px)").matches;
    const target = wide ? document.getElementById(`joiner-${focus}`) : document.getElementById("joiner-panel");
    target?.scrollIntoView({ block: "nearest", behavior: reduce ? "auto" : "smooth" });
  }, [focus, lens]);

  const visible = roster
    .filter((joiner) => inLens(joiner, lens) && matches(joiner))
    .sort((a, b) => healthOrder[a.health] - healthOrder[b.health] || a.day - b.day || a.name.localeCompare(b.name));

  const focused = roster.find((joiner) => joiner.id === focus) ?? null;
  const phase = isPhase(lens) ? phaseById(lens) : null;
  const inJourney = roster.filter((joiner) => joiner.day >= 1 && joiner.day <= 90).length;
  const soon = roster.filter((joiner) => joiner.day < 1).length;
  const attention = roster.filter((joiner) => joiner.health === "attention").length;
  const blocked = roster.filter((joiner) => joiner.health === "blocked").length;
  const filtersOn = lens !== "journey" || health !== "all" || location !== "all" || query.trim() !== "";

  return (
    <div>
      <PageIntro
        eyebrow="People & Culture"
        title="Lifecycle"
        lede="Follow every new joiner from Day 1 to Day 90. Choose a moment on the journey, then open a person to see what is done, what is stuck, and who owns it."
        extra={`Amira Hassan is the live profile in the Onboarding Hub, on ${formatLong(reviewDate)}. The other joiners are sample profiles so this view can show the full 90 days.`}
      />

      <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="In the first 90 days" value={inJourney} pressed={lens === "journey" && health === "all"} onClick={() => write({ phase: null, health: null, focus: null })} />
        <Stat label="Starting soon" value={soon} pressed={lens === "soon"} onClick={() => write({ phase: "soon", focus: null })} />
        <Stat label="Needs a look" value={attention} pressed={health === "attention"} onClick={() => write({ health: health === "attention" ? null : "attention", phase: "all", focus: null })} />
        <Stat label="Blocked" value={blocked} pressed={health === "blocked"} onClick={() => write({ health: health === "blocked" ? null : "blocked", phase: "all", focus: null })} />
      </div>

      <div className="mt-6">
        <Spine people={roster} lens={lens} focus={focus} matching={matches} onLens={(next) => write({ phase: next, focus: null })} onFocus={select} />
      </div>

      {phase ? (
        <div className={`${card} mt-4 px-5 py-4`}>
          <p className="text-sm font-semibold text-ink">{phase.label}</p>
          <p className="mt-1 text-sm leading-relaxed text-muted">{phase.objective}</p>
          <p className="mt-2 text-sm leading-relaxed text-ink">Watched here: {phase.watch}</p>
        </div>
      ) : null}

      <div className="mt-5 flex flex-col gap-3 lg:flex-row lg:items-end">
        <label className="block min-w-0 flex-1">
          <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">Search</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Name, team, manager, location"
            className="mt-1.5 w-full rounded-xl border border-line bg-card px-3 py-2 text-sm text-ink"
          />
        </label>
        <label className="block">
          <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">Location</span>
          <select
            value={location}
            onChange={(event) => write({ location: event.target.value })}
            className="mt-1.5 w-full rounded-xl border border-line bg-card px-3 py-2 text-sm text-ink lg:w-44"
          >
            <option value="all">All locations</option>
            {locations.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">Health</span>
          <select
            value={health === "blocked" || health === "attention" || health === "on_track" ? health : "all"}
            onChange={(event) => write({ health: event.target.value })}
            className="mt-1.5 w-full rounded-xl border border-line bg-card px-3 py-2 text-sm text-ink lg:w-44"
          >
            <option value="all">Everyone</option>
            <option value="on_track">On track</option>
            <option value="attention">Needs a look</option>
            <option value="blocked">Blocked</option>
          </select>
        </label>
        {filtersOn ? (
          <button type="button" onClick={() => { setQuery(""); write({ phase: null, health: null, location: null, focus: null }); }} className="text-sm font-medium text-violet hover:underline lg:mb-2">
            Clear filters
          </button>
        ) : null}
      </div>

      <div className="mt-6 grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="order-2 xl:order-1">
          <p className="mb-3 text-sm font-medium text-ink">
            {visible.length} {visible.length === 1 ? "joiner" : "joiners"}
          </p>
          {visible.length === 0 ? (
            <p className={`${card} px-5 py-8 text-sm leading-relaxed text-muted`}>
              {lens === "first-day"
                ? "No one is on Day 1 today. The 2 November class started yesterday and is in the first week."
                : "No joiners match this moment and filter."}
            </p>
          ) : (
            <ul className="space-y-3">
              {visible.map((joiner) => (
                <li key={joiner.id} id={`joiner-${joiner.id}`}>
                  <JoinerCard joiner={joiner} selected={focus === joiner.id} onSelect={() => write({ focus: joiner.id })} />
                </li>
              ))}
            </ul>
          )}
        </div>
        <div id="joiner-panel" className="order-1 xl:sticky xl:top-6 xl:order-2">
          {focused ? (
            <Dossier joiner={focused} mode="panel" />
          ) : (
            <div className={`${card} p-5`}>
              <h2 className="font-display text-2xl text-ink">Choose a joiner</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Their place on the 90 days, the milestone that needs a person, and the open work sit here.
              </p>
              <button type="button" onClick={() => select(roster.find((joiner) => joiner.live)!)} className="mt-4 text-sm font-medium text-violet hover:underline">
                Start with Amira Hassan
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  pressed,
  onClick,
}: {
  label: string;
  value: number;
  pressed: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className={`rounded-2xl border px-4 py-4 text-left ${pressed ? "border-violet bg-[#F7F4FF]" : "border-line bg-card hover:bg-paper"}`}
    >
      <span className="block font-display text-3xl text-ink">{value}</span>
      <span className="mt-1 block text-sm text-muted">{label}</span>
    </button>
  );
}

function JoinerCard({ joiner, selected, onSelect }: { joiner: JoinerView; selected: boolean; onSelect: () => void }) {
  const fill = joiner.health === "blocked" ? "bg-red" : joiner.health === "attention" ? "bg-gold" : "bg-violet";
  const width = joiner.day <= 0 ? 0 : joiner.day >= 90 ? 100 : (joiner.day / 90) * 100;
  return (
    <article className={`${card} ${selected ? "ring-2 ring-violet" : ""}`}>
      <button type="button" onClick={onSelect} className="w-full px-4 py-4 text-left sm:px-5">
        <div className="flex items-start gap-3">
          <Avatar initials={joiner.initials} tone={joiner.tone} />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-semibold text-ink">{joiner.name}</span>
              {joiner.live ? <LiveMark /> : null}
              <HealthPill health={joiner.health} />
            </div>
            <p className="mt-1 text-sm text-muted">
              {joiner.role} · {joiner.location}
            </p>
            <p className="mt-2 text-sm font-medium text-ink">
              {dayPhrase(joiner.day)} · {joiner.phase.label}
              {joiner.approaching ? ` · Approaching ${joiner.approaching}` : ""}
            </p>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-paper-deep" aria-hidden>
              <div className={`h-full rounded-full ${fill}`} style={{ width: `${width}%` }} />
            </div>
            <p className="mt-2 text-sm text-muted">{watchingLine(joiner)}</p>
            <p className="mt-1 text-xs text-muted">
              {joiner.manager} · {joiner.cohort}
            </p>
          </div>
        </div>
      </button>
      <div className="px-4 pb-4 sm:px-5">
        <Link href={`/admin/joiners/${joiner.id}`} className="text-sm font-medium text-violet hover:underline">
          Open record
        </Link>
      </div>
    </article>
  );
}
