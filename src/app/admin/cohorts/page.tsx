import Link from "next/link";
import { Avatar, HealthPill, PageIntro, card } from "@/components/admin/ui/primitives";
import { dayPhrase } from "@/lib/admin/copy";
import { formatLong } from "@/lib/admin/dates";
import { roster } from "@/lib/admin/lifecycle";

export const metadata = { title: "Cohorts" };

export default function CohortsPage() {
  const groups = new Map<string, typeof roster>();
  for (const joiner of roster) {
    const list = groups.get(joiner.cohort) ?? [];
    list.push(joiner);
    groups.set(joiner.cohort, list);
  }
  const cohorts = [...groups.values()].sort((a, b) => b[0].startDate.localeCompare(a[0].startDate));

  return (
    <div>
      <PageIntro
        eyebrow="People & Culture"
        title="Cohorts"
        lede="Two onboarding classes a month, on the first and third Monday. Location and readiness sit with the class, and each person still has their own 90 days."
        extra="Maya Iversen started on a Thursday. That start is an approved exception, kept beside the Monday classes."
      />
      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        {cohorts.map((members) => {
          const first = members[0];
          const blocked = members.filter((joiner) => joiner.health === "blocked").length;
          const attention = members.filter((joiner) => joiner.health === "attention").length;
          return (
            <section key={first.cohort} className={`${card} p-5`}>
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-red">{first.classKind}</p>
              <h2 className="mt-1 font-display text-3xl text-ink">{first.cohort}</h2>
              <p className="mt-1 text-sm text-muted">{formatLong(first.startDate)}</p>
              <p className="mt-3 text-sm text-ink">
                {members.length} {members.length === 1 ? "joiner" : "joiners"}
                {blocked > 0 ? ` · ${blocked} blocked` : ""}
                {attention > 0 ? ` · ${attention} ${attention === 1 ? "needs" : "need"} a look` : ""}
                {blocked === 0 && attention === 0 ? " · on track" : ""}
              </p>
              <ul className="mt-4 divide-y divide-line">
                {members
                  .slice()
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((joiner) => (
                    <li key={joiner.id}>
                      <Link href={`/admin/joiners/${joiner.id}`} className="flex items-center gap-3 py-3 hover:bg-paper">
                        <Avatar initials={joiner.initials} tone={joiner.tone} size="sm" />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-medium text-ink">{joiner.name}</span>
                          <span className="block truncate text-xs text-muted">
                            {joiner.location} · {dayPhrase(joiner.day)}
                          </span>
                        </span>
                        <HealthPill health={joiner.health} />
                      </Link>
                    </li>
                  ))}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}
