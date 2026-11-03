import Link from "next/link";
import { HealthPill, LiveMark, PageIntro, card } from "@/components/admin/ui/primitives";
import { dayPhrase, healthLabel } from "@/lib/admin/copy";
import { roster } from "@/lib/admin/lifecycle";
import { watchingLine } from "@/components/admin/joiner/dossier";

export const metadata = { title: "Joiners" };

export default function JoinersPage() {
  const people = [...roster].sort((a, b) => a.name.localeCompare(b.name));
  return (
    <div>
      <PageIntro
        eyebrow="People & Culture"
        title="Joiners"
        lede="Every Onboarding Hub profile in one list. Open a record to follow that person from Day 1 to Day 90."
        extra="Amira Hassan is live in the joiner hub. The rest of this list is sample data for the same journey."
      />
      <div className={`${card} mt-8 overflow-x-auto`}>
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="text-[11px] uppercase tracking-[0.12em] text-muted">
            <tr>
              <th className="px-4 py-3 font-semibold">Joiner</th>
              <th className="px-4 py-3 font-semibold">Day</th>
              <th className="px-4 py-3 font-semibold">Moment</th>
              <th className="px-4 py-3 font-semibold">Location</th>
              <th className="px-4 py-3 font-semibold">Manager</th>
              <th className="px-4 py-3 font-semibold">Health</th>
              <th className="px-4 py-3 font-semibold">Watching</th>
            </tr>
          </thead>
          <tbody>
            {people.map((joiner) => (
              <tr key={joiner.id} className="border-t border-line">
                <td className="px-4 py-3">
                  <Link href={`/admin/joiners/${joiner.id}`} className="font-medium text-ink hover:text-violet hover:underline">
                    {joiner.name}
                  </Link>
                  <span className="mt-0.5 block text-xs text-muted">{joiner.role}</span>
                  {joiner.live ? (
                    <span className="mt-1 inline-block">
                      <LiveMark />
                    </span>
                  ) : null}
                </td>
                <td className="px-4 py-3 text-ink">{dayPhrase(joiner.day)}</td>
                <td className="px-4 py-3 text-ink">{joiner.phase.label}</td>
                <td className="px-4 py-3 text-ink">
                  {joiner.location}
                  <span className="mt-0.5 block text-xs text-muted">{joiner.arrangement}</span>
                </td>
                <td className="px-4 py-3 text-ink">{joiner.manager}</td>
                <td className="px-4 py-3">
                  <HealthPill health={joiner.health} />
                  <span className="sr-only">{healthLabel(joiner.health)}</span>
                </td>
                <td className="px-4 py-3 text-muted">{watchingLine(joiner)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
