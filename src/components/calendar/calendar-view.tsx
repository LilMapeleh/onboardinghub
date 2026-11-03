"use client";

import { useState } from "react";
import { useJoiner } from "@/components/joiner/joiner-context";
import { PageIntro, card } from "@/components/ui/primitives";
import { addDays, dateForDay, formatLong, formatMedium, startOfWeek } from "@/lib/dates";
import type { EventView } from "@/lib/selectors";

export function CalendarView() {
  const { date } = useJoiner();
  return <CalendarWeek key={date} />;
}

function CalendarWeek() {
  const { date, day, schedule, eventWhen } = useJoiner();
  const [weekStart, setWeekStart] = useState(() => startOfWeek(date));

  const days = Array.from({ length: 7 }, (_, index) => addDays(weekStart, index));
  const min = startOfWeek(dateForDay(-6));
  const max = startOfWeek(dateForDay(90));
  const weekEvents = schedule
    .filter((event) => event.date >= weekStart && event.date <= days[6])
    .sort((a, b) => a.date.localeCompare(b.date) || a.start.localeCompare(b.start));
  const later = schedule.find((event) => event.date > days[6]);

  return (
    <div>
      <PageIntro
        eyebrow="Calendar"
        title="Where to be."
        lede="Your sessions, setup, buddy time and the 30, 60 and 90 conversations. Classes run on the first and third Monday of the month. Yours was 19 October."
      />
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="font-display text-2xl">{formatMedium(weekStart)} – {formatMedium(days[6])}</p>
        <div className="flex gap-2">
          <button
            type="button"
            className="rounded-full bg-card px-3 py-1.5 text-sm ring-1 ring-line disabled:opacity-40"
            disabled={weekStart <= min}
            onClick={() => setWeekStart(addDays(weekStart, -7))}
          >
            Previous
          </button>
          <button
            type="button"
            className="rounded-full bg-card px-3 py-1.5 text-sm ring-1 ring-line disabled:opacity-40"
            disabled={weekStart >= max}
            onClick={() => setWeekStart(addDays(weekStart, 7))}
          >
            Next
          </button>
        </div>
      </div>
      <ol className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
        {days.map((iso) => {
          const events = schedule.filter((event) => event.date === iso);
          const isToday = iso === date;
          return (
            <li key={iso} className={`min-h-36 rounded-3xl border p-3 ${isToday ? "border-pine bg-pine text-white" : "border-line bg-card"}`}>
              <p className={`text-xs ${isToday ? "text-white/70" : "text-muted"}`}>{formatMedium(iso)}</p>
              <ul className="mt-3 space-y-2">
                {events.map((event) => (
                  <li key={event.id} className={`rounded-xl px-2 py-1.5 text-xs leading-snug ${isToday ? "bg-white/10" : "bg-paper"}`}>
                    <span className="block font-medium tabular-nums">{event.start}</span>
                    <span className="block">{event.title}</span>
                  </li>
                ))}
              </ul>
            </li>
          );
        })}
      </ol>
      <section className="mt-8">
        <h2 className="font-display text-3xl">This week</h2>
        {weekEvents.length === 0 ? (
          <p className="mt-3 text-sm leading-relaxed text-muted">
            Nothing scheduled.
            {later ? ` Next is ${later.title} on ${formatLong(later.date)}.` : ""}
          </p>
        ) : (
          <ul className="mt-4 space-y-3">
            {weekEvents.map((event) => (
              <EventRow key={event.id} event={event} when={eventWhen(event)} today={event.day === day} />
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function EventRow({ event, when, today }: { event: EventView; when: string; today: boolean }) {
  return (
    <li className={`${card} flex flex-col gap-2 p-4 sm:flex-row sm:items-start sm:justify-between`}>
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-red">{today ? "Today" : event.kind.replace("-", " ")}</p>
        <h3 className="mt-1 font-medium">{event.title}</h3>
        <p className="mt-1 text-sm text-muted">{event.detail}</p>
        <p className="mt-2 text-sm">
          {event.who} · {event.where}
        </p>
      </div>
      <p className="shrink-0 text-sm font-medium tabular-nums">
        {when}
        <span className="mt-1 block font-normal text-muted">
          until {event.end}
        </span>
      </p>
    </li>
  );
}
