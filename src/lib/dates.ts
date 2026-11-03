/** Day 1 of the sample journey. Dates are calendar dates, not timestamps. */
export const START_DATE = "2026-10-19";

export function addDays(iso: string, days: number): string {
  const [year, month, day] = iso.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day + days));
  return date.toISOString().slice(0, 10);
}

export function diffDays(from: string, to: string): number {
  const start = Date.parse(`${from}T00:00:00Z`);
  const end = Date.parse(`${to}T00:00:00Z`);
  return Math.round((end - start) / 86_400_000);
}

export function dateForDay(day: number): string {
  return addDays(START_DATE, day - 1);
}

export function dayNumber(iso: string): number {
  return diffDays(START_DATE, iso) + 1;
}

export function formatLong(iso: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "UTC",
  }).format(new Date(`${iso}T00:00:00Z`));
}

export function formatMedium(iso: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  }).format(new Date(`${iso}T00:00:00Z`));
}

export function formatMonthYear(iso: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${iso}T00:00:00Z`));
}

export function startOfWeek(iso: string): string {
  const [year, month, day] = iso.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  const weekday = date.getUTCDay();
  const delta = weekday === 0 ? -6 : 1 - weekday;
  return addDays(iso, delta);
}

export function monthStart(iso: string): string {
  const [year, month] = iso.split("-").map(Number);
  return `${year}-${String(month).padStart(2, "0")}-01`;
}

export function daysInMonth(iso: string): number {
  const [year, month] = iso.split("-").map(Number);
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}
