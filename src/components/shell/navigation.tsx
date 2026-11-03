"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useJoiner } from "@/components/joiner/joiner-context";
import { Icon } from "@/components/ui/icon";
import { dateForDay, formatMedium } from "@/lib/dates";
import { PREVIEWS } from "@/lib/content";

const links = [
  { href: "/", label: "Home", icon: "home" },
  { href: "/journey", label: "Journey", icon: "path" },
  { href: "/tasks", label: "Tasks", icon: "tasks" },
  { href: "/explore", label: "Explore", icon: "compass" },
  { href: "/people", label: "People", icon: "people" },
  { href: "/calendar", label: "Calendar", icon: "calendar" },
] as const;

function isCurrent(pathname: string, href: string): boolean {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export function PreviewSelect({ variant = "dark" }: { variant?: "dark" | "light" }) {
  const { previewId, setPreview } = useJoiner();
  const dark = variant === "dark";
  return (
    <label className="block">
      <span className={`text-[11px] font-semibold uppercase tracking-[0.14em] ${dark ? "text-white/50" : "text-muted"}`}>
        Preview the journey
      </span>
      <select
        value={previewId}
        onChange={(event) => setPreview(event.target.value)}
        style={{ colorScheme: dark ? "dark" : "light" }}
        className={`mt-2 w-full rounded-xl px-3 py-2 text-sm ${
          dark
            ? "border border-white/10 bg-white/10 text-white"
            : "border border-line bg-card text-ink"
        }`}
      >
        {PREVIEWS.map((preview) => (
          <option key={preview.id} value={preview.id} className="text-ink">
            {preview.label} · {formatMedium(dateForDay(preview.day))}
          </option>
        ))}
      </select>
      <span className={`mt-2 block text-xs leading-relaxed ${dark ? "text-white/45" : "text-muted"}`}>
        For this review. The live hub follows the real date.
      </span>
    </label>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const { tasks, employee } = useJoiner();
  const now = tasks.filter((task) => task.status !== "completed" && task.status !== "locked").length;

  return (
    <aside className="sticky top-3 hidden h-[calc(100dvh-1.5rem)] flex-col overflow-y-auto rounded-[28px] bg-pine text-white lg:flex">
      <div className="flex items-center gap-3 px-5 py-6">
        <span className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-[#5C2DFF] via-[#E23886] to-[#FF2A3A] font-display text-lg text-white">
          S
        </span>
        <span>
          <span className="block text-[11px] font-semibold uppercase tracking-[0.16em] text-white/50">Sitecore</span>
          <span className="block text-sm font-medium">Onboarding Hub</span>
        </span>
      </div>
      <nav className="flex flex-1 flex-col gap-1 px-3" aria-label="Your onboarding">
        {links.map((link) => {
          const current = isCurrent(pathname, link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              aria-current={current ? "page" : undefined}
              className={`flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm ${
                current ? "bg-white/10 text-white" : "text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon name={link.icon} className="h-5 w-5" />
              <span className="flex-1">{link.label}</span>
              {link.href === "/tasks" && now > 0 ? (
                <span className="rounded-full bg-white/15 px-2 py-0.5 text-xs">{now}</span>
              ) : null}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-white/10 px-5 py-5">
        <p className="text-sm font-medium">{employee.name}</p>
        <p className="mt-0.5 text-xs text-white/55">{employee.role}</p>
        <div className="mt-4">
          <PreviewSelect />
        </div>
      </div>
    </aside>
  );
}

export function MobileNav() {
  const pathname = usePathname();
  return (
    <nav className="flex gap-2 overflow-x-auto px-4 pb-3 lg:hidden" aria-label="Your onboarding">
      {links.map((link) => {
        const current = isCurrent(pathname, link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={current ? "page" : undefined}
            className={`shrink-0 rounded-full px-3 py-1.5 text-sm ${
              current ? "bg-pine text-white" : "bg-card text-ink ring-1 ring-line"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function TopBar() {
  const router = useRouter();
  const pathname = usePathname();
  const { employee, notices, openTask, query, setQuery } = useJoiner();
  const [open, setOpen] = useState(false);
  const [seen, setSeen] = useState("");
  const noticeKey = notices.map((notice) => notice.id).join("|");
  const unread = notices.length > 0 && seen !== noticeKey;
  const initials = employee.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2);

  return (
    <header className="sticky top-0 z-20 bg-white">
      <div className="flex items-center gap-3 px-4 py-3 lg:px-6">
        <div className="flex shrink-0 items-center gap-2 lg:hidden">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-[#5C2DFF] via-[#E23886] to-[#FF2A3A] font-display text-white">
            S
          </span>
        </div>
        <form
          className="mx-auto flex w-full max-w-xl items-center gap-2 rounded-full border border-line bg-paper px-4 py-2"
          onSubmit={(event) => {
            event.preventDefault();
            if (pathname !== "/") router.push("/");
          }}
        >
          <Icon name="search" className="h-4 w-4 text-muted" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search"
            aria-label="Search"
            className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-muted"
          />
        </form>
        <div className="relative flex shrink-0 items-center gap-1.5">
          <Link
            href="/people"
            className="grid h-10 w-10 place-items-center rounded-full text-ink hover:bg-paper"
            aria-label="People"
          >
            <Icon name="message" className="h-5 w-5" />
          </Link>
          <button
            type="button"
            className="relative grid h-10 w-10 place-items-center rounded-full text-ink hover:bg-paper"
            aria-label={unread ? `Notifications, ${notices.length} new` : "Notifications"}
            aria-expanded={open}
            onClick={() => {
              setOpen((value) => !value);
              setSeen(noticeKey);
            }}
          >
            <Icon name="bell" className="h-5 w-5" />
            {unread ? (
              <span className="absolute right-2 top-2 grid h-4 min-w-4 place-items-center rounded-full bg-red px-1 text-[10px] font-semibold text-white">
                {notices.length}
              </span>
            ) : null}
          </button>
          <span
            className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-[#5C2DFF] to-[#E23886] text-xs font-semibold text-white"
            aria-hidden
          >
            {initials}
          </span>
          {open ? (
            <div className="absolute right-0 top-12 z-30 w-[min(22rem,calc(100vw-2rem))] rounded-3xl border border-line bg-card p-3 shadow-2xl">
              <p className="px-2 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-muted">For you</p>
              {notices.length === 0 ? (
                <p className="px-2 py-4 text-sm text-muted">Nothing new. Your next step is on the home page.</p>
              ) : (
                <ul className="max-h-80 overflow-auto">
                  {notices.map((notice) => (
                    <li key={notice.id}>
                      <button
                        type="button"
                        className="w-full rounded-2xl px-2 py-3 text-left hover:bg-paper"
                        onClick={() => {
                          if (notice.taskId) openTask(notice.taskId);
                          if (notice.href) router.push(notice.href);
                          setOpen(false);
                        }}
                      >
                        <span className="block text-sm font-medium">{notice.title}</span>
                        <span className="mt-1 block text-xs leading-relaxed text-muted">{notice.body}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ) : null}
        </div>
      </div>
      <div className="h-1.5 bg-gradient-to-r from-[#5C2DFF] via-[#E23886] to-[#FF2A3A]" />
      <div className="px-4 pb-3 pt-3 lg:hidden">
        <PreviewSelect variant="light" />
      </div>
      <MobileNav />
    </header>
  );
}
