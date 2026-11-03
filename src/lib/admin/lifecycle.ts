import { AS_OF, dateForJourneyDay, formatMedium, journeyDay } from "@/lib/admin/dates";
import { joiners } from "@/lib/admin/joiners";
import { badgeRules, milestones, phases, programme } from "@/lib/admin/programme";
import type {
  Health,
  JoinerSeed,
  JoinerView,
  MilestoneView,
  PhaseId,
  SignalDef,
  SignalStatus,
  SignalView,
} from "@/lib/admin/types";

function attentionRank(signal: SignalView, day: number): number {
  if (signal.status === "blocked") return 0;
  if (signal.status === "overdue") return 1;
  if ((signal.status === "open" || signal.status === "in_progress") && signal.dueOnDay <= day) return 2;
  if (signal.status === "in_progress") return 3;
  if (signal.status === "waiting") return 4;
  if (signal.status === "open") return 5;
  if (signal.status === "upcoming") return 6;
  return 7;
}

function firstName(name: string): string {
  return name.split(" ")[0] ?? name;
}

function fill(template: string, seed: JoinerSeed): string {
  const buddy = seed.buddy.startsWith("Not ") ? "your buddy" : firstName(seed.buddy);
  return template.replaceAll("{manager}", firstName(seed.manager)).replaceAll("{buddy}", buddy);
}

function ownerFor(signal: SignalDef, seed: JoinerSeed): string {
  switch (signal.ownerKind) {
    case "manager":
      return seed.manager;
    case "buddy":
      return seed.buddy;
    case "hr":
      return seed.support.hr;
    case "it":
      return seed.support.it;
    case "workplace":
      return seed.support.workplace;
    case "experience":
      return seed.support.experience;
    case "joiner":
      return seed.name;
  }
}

function resolveStatus(signal: SignalDef, day: number, seed: JoinerSeed): SignalStatus {
  const hold = seed.holds?.find((item) => item.id === signal.id);
  if (day < signal.opensOnDay) return "upcoming";
  if (hold?.kind === "waiting" && day <= (hold.untilDay ?? signal.dueOnDay)) return "waiting";
  if (hold?.kind === "blocked") return "blocked";
  if (hold?.kind === "open") {
    if (day > signal.dueOnDay) return "overdue";
    if (signal.inProgressFromDay != null && day >= signal.inProgressFromDay) return "in_progress";
    return "open";
  }
  if (day > signal.completesOnDay) return "done";
  if (signal.inProgressFromDay != null && day >= signal.inProgressFromDay) return "in_progress";
  if (day > signal.dueOnDay) return "overdue";
  return "open";
}

function detailFor(signal: SignalDef, status: SignalStatus, day: number, seed: JoinerSeed): string {
  if (status === "done") return "Done";
  const due = dateForJourneyDay(seed.startDate, signal.dueOnDay);
  const when =
    status === "upcoming"
      ? `Opens ${formatMedium(dateForJourneyDay(seed.startDate, signal.opensOnDay))}`
      : signal.dueOnDay === day
        ? "Due today"
        : signal.dueOnDay - day === 1
          ? "Due tomorrow"
          : status === "overdue"
            ? `Overdue · ${formatMedium(due)}`
            : `Due ${formatMedium(due)}`;
  const hold = seed.holds?.find((item) => item.id === signal.id);
  const note = hold?.note && status !== "upcoming" ? hold.note : seed.notes?.[signal.id];
  if (note && status !== "upcoming") {
    if (status === "waiting" || status === "blocked") return note;
    return `${note} ${when}.`;
  }
  return when;
}

function signalView(signal: SignalDef, day: number, seed: JoinerSeed): SignalView {
  const status = resolveStatus(signal, day, seed);
  const hold = seed.holds?.find((item) => item.id === signal.id);
  return {
    id: signal.id,
    title: seed.titles?.[signal.id] ?? fill(signal.title, seed),
    owner: ownerFor(signal, seed),
    ownerKind: signal.ownerKind,
    system: signal.system,
    opensOnDay: signal.opensOnDay,
    dueOnDay: signal.dueOnDay,
    completesOnDay: signal.completesOnDay,
    milestone: signal.milestone,
    status,
    detail: detailFor(signal, status, day, seed),
    expected: hold?.expected,
    note: hold?.note,
  };
}

function milestoneStatus(signals: SignalView[], day: number, milestoneDay: number): MilestoneView["status"] {
  if (signals.length === 0) return day >= milestoneDay ? "due" : "upcoming";
  if (signals.some((signal) => signal.status === "blocked")) return "blocked";
  if (signals.some((signal) => signal.status === "overdue")) return "overdue";
  if (signals.every((signal) => signal.status === "done")) return "done";
  if (signals.some((signal) => signal.status === "upcoming") && signals.every((signal) => signal.status === "upcoming" || signal.status === "done")) {
    return "upcoming";
  }
  const active = signals.filter((signal) => signal.status !== "done" && signal.status !== "upcoming");
  if (active.some((signal) => signal.dueOnDay <= day)) return "due";
  if (active.length > 0) return "now";
  return "upcoming";
}

function healthFor(signals: SignalView[], day: number): Health {
  if (signals.some((signal) => signal.status === "blocked")) return "blocked";
  if (signals.some((signal) => signal.status === "overdue")) return "attention";
  if (signals.some((signal) => (signal.status === "open" || signal.status === "in_progress") && signal.dueOnDay <= day)) {
    return "attention";
  }
  return "on_track";
}

function approaching(day: number): JoinerView["approaching"] {
  if (day >= 23 && day <= 34) return "Day 30";
  if (day >= 53 && day <= 64) return "Day 60";
  if (day >= 76 && day <= 90) return "Day 90";
  return null;
}

function build(seed: JoinerSeed): JoinerView {
  const day = journeyDay(seed.startDate);
  const definitions = [...programme, ...(seed.extras ?? [])];
  const signals = definitions
    .map((signal) => signalView(signal, day, seed))
    .sort((a, b) => attentionRank(a, day) - attentionRank(b, day) || a.dueOnDay - b.dueOnDay || a.title.localeCompare(b.title));
  const milestoneViews: MilestoneView[] = milestones.map((milestone) => ({
    id: milestone.id,
    label: milestone.label,
    day: milestone.day,
    status: milestoneStatus(
      signals.filter((signal) => milestone.signalIds.includes(signal.id)),
      day,
      milestone.day,
    ),
  }));
  const phase = phases.find((item) => day >= item.from && day <= item.to) ?? phases[phases.length - 1];
  const badges = badgeRules.map((badge) => ({
    id: badge.id,
    name: badge.name,
    earned: badge.requires.every((id) => signals.find((signal) => signal.id === id)?.status === "done"),
  }));
  const next = signals.find((signal) => signal.status !== "done") ?? null;
  const concern = milestoneViews.find((item) => item.status === "blocked" || item.status === "overdue" || item.status === "due") ?? null;
  return {
    id: seed.id,
    live: seed.live,
    firstName: seed.firstName,
    name: seed.name,
    role: seed.role,
    department: seed.department,
    team: seed.team,
    location: seed.location,
    arrangement: seed.arrangement,
    manager: seed.manager,
    buddy: seed.buddy,
    cohort: seed.cohort,
    classKind: seed.classKind,
    personalEmail: seed.personalEmail,
    workEmail: seed.workEmail,
    offerAccepted: seed.offerAccepted,
    startDate: seed.startDate,
    initials: seed.initials,
    tone: seed.tone,
    support: seed.support,
    day,
    phase,
    health: healthFor(signals, day),
    approaching: approaching(day),
    signals,
    milestones: milestoneViews,
    badges,
    next,
    concern,
  };
}

export const roster: JoinerView[] = joiners.map(build).sort((a, b) => a.day - b.day || a.name.localeCompare(b.name));

export function getJoiner(id: string): JoinerView | null {
  return roster.find((joiner) => joiner.id === id) ?? null;
}

export function phaseById(id: string) {
  return phases.find((phase) => phase.id === id) ?? null;
}

export type Lens = "journey" | "all" | PhaseId;

export function parseLens(value: string | null): Lens {
  if (value === "all") return "all";
  if (value && phases.some((phase) => phase.id === value)) return value as PhaseId;
  return "journey";
}

export function inLens(joiner: JoinerView, lens: Lens): boolean {
  if (lens === "all") return true;
  if (lens === "journey") return joiner.day >= 1 && joiner.day <= 90;
  return joiner.phase.id === lens;
}

export function placement(people: JoinerView[]) {
  const byDay = new Map<number, JoinerView[]>();
  for (const joiner of people) {
    if (joiner.day < 1 || joiner.day > 90) continue;
    const group = byDay.get(joiner.day) ?? [];
    group.push(joiner);
    byDay.set(joiner.day, group);
  }
  const placed = new Map<string, { left: number; offset: number }>();
  for (const [day, group] of byDay) {
    group.forEach((joiner, index) => {
      placed.set(joiner.id, {
        left: ((day - 1) / 89) * 100,
        offset: (index - (group.length - 1) / 2) * 40,
      });
    });
  }
  return placed;
}

export function bandFor(phaseId: PhaseId): { left: number; width: number } | null {
  const phase = phaseById(phaseId);
  if (!phase) return null;
  const from = Math.max(phase.from, 1);
  const to = Math.min(phase.to, 90);
  if (to < 1 || from > 90) return null;
  const left = ((from - 1) / 89) * 100;
  const right = ((to - 1) / 89) * 100;
  return { left, width: Math.max(right - left, 1.6) };
}

export const reviewDate = AS_OF;

function signalStatus(joiner: JoinerView, id: string): SignalStatus | undefined {
  return joiner.signals.find((signal) => signal.id === id)?.status;
}

function expect(condition: boolean, message: string) {
  if (!condition) throw new Error(message);
}

const amira = getJoiner("amira");
expect(amira?.day === 16, `Amira should be on day 16 to match the Onboarding Hub. Got ${amira?.day}.`);
expect(signalStatus(amira!, "listening-week1") === "done", "Amira Week 1 listening should be done.");
expect(signalStatus(amira!, "compliance") === "in_progress", "Amira compliance should be in progress.");
expect(signalStatus(amira!, "culture") === "open", "Amira culture explorer should be open.");
expect(signalStatus(amira!, "first-task") === "in_progress", "Amira shadow task should be in progress.");
expect(signalStatus(amira!, "monitor") === "waiting", "Amira's monitor should be on its way.");
expect(signalStatus(amira!, "day30-checkin") === "upcoming", "Amira Day 30 check-in should be later.");
expect(amira?.health === "on_track", "Amira should be on track.");
expect(amira?.badges.filter((badge) => badge.earned).map((badge) => badge.id).join(",") === "welcome,first-day,connected", "Amira badges should match the Hub.");
expect(getJoiner("jonah")?.health === "attention", "Jonah should need a look.");
expect(getJoiner("diego")?.health === "blocked", "Diego should be blocked.");
expect(getJoiner("marcus")?.health === "blocked", "Marcus should be blocked.");
expect(getJoiner("maya")?.health === "attention", "Maya should need a look.");
expect(getJoiner("tom")?.health === "blocked", "Tom should be blocked.");
expect(getJoiner("sofia")?.day === 30, "Sofia should be on day 30.");
expect(getJoiner("elena")?.phase.id === "closed", "Elena's journey should be closed.");
expect(getJoiner("hana")?.day === 2, "Hana should be on day 2.");
expect(roster.length === 13, "Expected 13 Onboarding Hub profiles.");
