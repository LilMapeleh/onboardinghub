import type { Health, MilestoneView, SignalStatus } from "@/lib/admin/types";
import { healthLabel, milestoneLabel, statusLabel } from "@/lib/admin/copy";

export const card =
  "rounded-2xl border border-line bg-card shadow-[0_1px_2px_rgba(28,28,40,0.04),0_12px_32px_-24px_rgba(42,20,104,0.35)]";

export function Avatar({
  initials,
  tone,
  size = "md",
}: {
  initials: string;
  tone: string;
  size?: "sm" | "md" | "lg";
}) {
  const dimensions = { sm: "h-8 w-8 text-[11px]", md: "h-11 w-11 text-sm", lg: "h-14 w-14 text-base" }[size];
  return (
    <span
      className={`grid shrink-0 place-items-center rounded-full font-semibold text-white ${dimensions}`}
      style={{ backgroundColor: tone }}
    >
      {initials}
    </span>
  );
}

export function HealthPill({ health }: { health: Health }) {
  const tone =
    health === "blocked" ? "bg-rust-soft text-rust" : health === "attention" ? "bg-gold-soft text-gold" : "bg-[#EEE9FF] text-violet";
  return <span className={`inline-flex shrink-0 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ${tone}`}>{healthLabel(health)}</span>;
}

export function StatusPill({ status }: { status: SignalStatus }) {
  const tone = {
    done: "bg-[#EEE9FF] text-violet",
    in_progress: "bg-pine text-white",
    waiting: "bg-gold-soft text-gold",
    overdue: "bg-rust-soft text-rust",
    blocked: "bg-red text-white",
    open: "bg-paper-deep text-ink",
    upcoming: "bg-paper-deep text-muted",
  }[status];
  return <span className={`inline-flex shrink-0 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ${tone}`}>{statusLabel(status)}</span>;
}

export function MilestonePill({ status }: { status: MilestoneView["status"] }) {
  const tone = {
    done: "bg-[#EEE9FF] text-violet",
    now: "bg-pine text-white",
    due: "bg-gold-soft text-gold",
    overdue: "bg-rust-soft text-rust",
    blocked: "bg-red text-white",
    upcoming: "bg-paper-deep text-muted",
  }[status];
  return <span className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium ${tone}`}>{milestoneLabel(status)}</span>;
}

export function PageIntro({
  eyebrow,
  title,
  lede,
  extra,
}: {
  eyebrow: string;
  title: string;
  lede: string;
  extra?: string;
}) {
  return (
    <header className="max-w-3xl">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-red">{eyebrow}</p>
      <h1 className="mt-2 font-display text-4xl leading-[1.05] text-ink sm:text-5xl">{title}</h1>
      <p className="mt-3 text-base leading-relaxed text-muted">{lede}</p>
      {extra ? <p className="mt-2 text-sm leading-relaxed text-ink">{extra}</p> : null}
    </header>
  );
}

export function LiveMark() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-red/10 px-2 py-0.5 text-[11px] font-semibold text-red">
      <span className="h-1.5 w-1.5 rounded-full bg-red" />
      Live in the Hub
    </span>
  );
}
