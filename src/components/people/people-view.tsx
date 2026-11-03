"use client";

import { useJoiner } from "@/components/joiner/joiner-context";
import { Avatar, Button, PageIntro, card } from "@/components/ui/primitives";
import { START_DATE, formatLong } from "@/lib/dates";
import type { Person } from "@/lib/types";

export function PeopleView() {
  const { people, employee, day, showExternal } = useJoiner();
  const groups: { id: Person["group"]; title: string; lede: string }[] = [
    { id: "close", title: "With you through the 90 days", lede: "Your manager and your buddy." },
    { id: "support", title: "If you need something specific", lede: "Each of them owns a part of onboarding. You do not have to coordinate them." },
    { id: "team", title: "Your team", lede: "The people you will work beside in EMEA Solutions." },
  ];

  return (
    <div>
      <PageIntro
        eyebrow="People"
        title="Someone for every kind of question."
        lede="Start with Priya or Sam if you are not sure. The others are here when the question is about access, the office, learning or your record."
      />
      <section className={`${card} mb-8 w-full p-5`}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Fact label="You" value={`${employee.name}, ${employee.role}`} />
        <Fact label="Team" value={`${employee.team}, ${employee.department}`} />
        <Fact label="Location" value={employee.location} />
        <Fact label="Manager" value={employee.manager} />
        <Fact label="Starts" value={formatLong(START_DATE)} />
        <Fact label="Class" value={employee.cohort} />
        <Fact
          label={day < 1 ? "Personal email" : "Sitecore email"}
          value={day < 1 ? employee.personalEmail : employee.workEmail}
        />
        </div>
        <p className="mt-4 text-sm leading-relaxed text-muted">
          {day < 1
            ? "Your profile was opened when the offer was accepted. We will use your personal email until the Sitecore account exists."
            : "Your Sitecore account is active. The same journey is available in Teams once that connection is live."}
        </p>
      </section>
      <div className="space-y-10">
        {groups.map((group) => (
          <section key={group.id}>
            <h2 className="font-display text-3xl">{group.title}</h2>
            <p className="mt-1 text-sm text-muted">{group.lede}</p>
            <ul className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-2">
              {people
                .filter((person) => person.group === group.id)
                .map((person) => (
                  <li key={person.id} className={`${card} p-5`}>
                    <div className="flex items-center gap-3">
                      <Avatar initials={person.initials} tone={person.tone} size="lg" />
                      <div>
                        <p className="font-medium">{person.name}</p>
                        <p className="text-sm text-muted">
                          {person.role} · {person.location}
                        </p>
                      </div>
                    </div>
                    <p className="mt-4 text-sm leading-relaxed">{person.helps}</p>
                    {person.note && (person.noteFromDay == null || day >= person.noteFromDay) ? (
                      <p className="mt-3 text-sm leading-relaxed text-muted">“{person.note}”</p>
                    ) : null}
                    {day >= 1 ? (
                      <Button variant="quiet" className="mt-4" onClick={() => showExternal("Teams")}>
                        Message on Teams
                      </Button>
                    ) : (
                      <p className="mt-4 text-xs text-muted">You will be able to reach them on Teams from day one.</p>
                    )}
                  </li>
                ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <p className="text-xs uppercase tracking-[0.12em] text-muted">{label}</p>
      <p className="mt-1 text-sm font-medium break-words">{value}</p>
    </div>
  );
}
