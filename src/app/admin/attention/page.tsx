import Link from "next/link";
import { Avatar, PageIntro, card } from "@/components/admin/ui/primitives";
import { dayPhrase } from "@/lib/admin/copy";
import { formatMedium } from "@/lib/admin/dates";
import { roster } from "@/lib/admin/lifecycle";
import type { JoinerView, SignalView } from "@/lib/admin/types";

export const metadata = { title: "Attention" };

export default function AttentionPage() {
  const blocked = roster.filter((joiner) => joiner.health === "blocked");
  const attention = roster.filter((joiner) => joiner.health === "attention");
  const approaching = roster.filter((joiner) => joiner.health === "on_track" && joiner.approaching && joiner.day <= 90);

  return (
    <div>
      <PageIntro
        eyebrow="People & Culture"
        title="Attention"
        lede="Blocked work, overdue milestones, and the people coming up to Day 30, Day 60 or Day 90. Each item names an owner."
      />
      <div className="mt-8 space-y-8">
        <Queue
          title="Blocked"
          empty="Nothing is blocked."
          people={blocked}
          pick={(joiner) => joiner.signals.filter((signal) => signal.status === "blocked")}
        />
        <Queue
          title="Needs a look"
          empty="Nothing is overdue or due today."
          people={attention}
          pick={(joiner) =>
            joiner.signals.filter(
              (signal) =>
                signal.status === "overdue" ||
                ((signal.status === "open" || signal.status === "in_progress") && signal.dueOnDay <= joiner.day),
            )
          }
        />
        <Queue
          title="Approaching a milestone"
          empty="No one on track is inside a Day 30, Day 60 or Day 90 window."
          people={approaching}
          pick={(joiner) => (joiner.next ? [joiner.next] : [])}
          hint={(joiner) => joiner.approaching ?? ""}
        />
      </div>
    </div>
  );
}

function Queue({
  title,
  empty,
  people,
  pick,
  hint,
}: {
  title: string;
  empty: string;
  people: JoinerView[];
  pick: (joiner: JoinerView) => SignalView[];
  hint?: (joiner: JoinerView) => string;
}) {
  return (
    <section>
      <h2 className="text-lg font-semibold text-ink">
        {title} <span className="text-muted">{people.length}</span>
      </h2>
      {people.length === 0 ? (
        <p className={`${card} mt-3 px-5 py-6 text-sm text-muted`}>{empty}</p>
      ) : (
        <ul className="mt-3 space-y-3">
          {people.map((joiner) => (
            <li key={joiner.id} className={`${card} p-4`}>
              <div className="flex items-start gap-3">
                <Avatar initials={joiner.initials} tone={joiner.tone} size="sm" />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <Link href={`/admin/joiners/${joiner.id}`} className="font-semibold text-ink hover:text-violet hover:underline">
                      {joiner.name}
                    </Link>
                    <span className="text-sm text-muted">
                      {dayPhrase(joiner.day)} · {joiner.location}
                      {hint ? ` · ${hint(joiner)}` : ""}
                    </span>
                  </div>
                  <ul className="mt-3 space-y-2">
                    {pick(joiner).map((signal) => (
                      <li key={signal.id} className="text-sm leading-relaxed text-ink">
                        <span className="font-medium">{signal.title}</span>
                        <span className="text-muted">
                          {" "}
                          · {signal.owner}
                          {signal.expected ? ` · Expected ${formatMedium(signal.expected)}` : ""}
                        </span>
                        <span className="mt-0.5 block text-muted">{signal.detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
