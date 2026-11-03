import type { ButtonHTMLAttributes, ReactNode } from "react";
import type { TaskView } from "@/lib/selectors";

export const card =
  "rounded-2xl border border-line bg-card shadow-[0_1px_2px_rgba(28,28,40,0.04),0_12px_32px_-24px_rgba(42,20,104,0.35)]";

export function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "quiet" | "ghost" }) {
  const styles = {
    primary: "bg-red text-white hover:bg-red-dark",
    quiet: "border border-line bg-card text-ink hover:bg-paper",
    ghost: "text-ink hover:bg-paper-deep",
  }[variant];
  return (
    <button
      {...props}
      type="button"
      className={`inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50 ${styles} ${className}`}
    />
  );
}

export function StatusPill({ task }: { task: TaskView }) {
  const label = task.overdue
    ? "Overdue"
    : {
        not_started: "To do",
        in_progress: "In progress",
        completed: "Done",
        waiting: "On its way",
        locked: "Later",
      }[task.status];
  const tone = task.overdue
    ? "bg-rust-soft text-rust"
    : {
        not_started: "bg-paper-deep text-ink",
        in_progress: "bg-pine text-white",
        completed: "bg-moss/15 text-moss",
        waiting: "bg-gold-soft text-gold",
        locked: "bg-paper-deep text-muted",
      }[task.status];
  return <span className={`inline-flex shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${tone}`}>{label}</span>;
}

export function PageIntro({
  eyebrow,
  title,
  lede,
}: {
  eyebrow: string;
  title: string;
  lede: string;
}) {
  return (
    <header className="mb-8 max-w-2xl">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-red">{eyebrow}</p>
      <h1 className="mt-2 font-display text-4xl leading-[1.05] text-ink sm:text-5xl">{title}</h1>
      <p className="mt-3 text-base leading-relaxed text-muted">{lede}</p>
    </header>
  );
}

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
      className={`grid shrink-0 place-items-center rounded-full font-medium text-white ${dimensions}`}
      style={{ backgroundColor: tone }}
    >
      {initials}
    </span>
  );
}

export function SectionHeading({ title, action }: { title: string; action?: ReactNode }) {
  return (
    <div className="mb-3 flex items-baseline justify-between gap-4">
      <h2 className="font-display text-[1.7rem] leading-none text-ink">{title}</h2>
      {action}
    </div>
  );
}
