"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { roster } from "@/lib/admin/lifecycle";

const links = [
  { href: "/admin", label: "Lifecycle", exact: true },
  { href: "/admin/joiners", label: "Joiners", exact: false },
  { href: "/admin/cohorts", label: "Cohorts", exact: false },
  { href: "/admin/attention", label: "Attention", exact: false },
] as const;

function current(pathname: string, href: string, exact: boolean): boolean {
  if (exact) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Brand() {
  return (
    <Link href="/admin" className="flex items-center gap-3">
      <span className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-[#5C2DFF] via-[#E23886] to-[#FF2A3A] font-display text-lg text-white">
        S
      </span>
      <span>
        <span className="block text-[11px] font-semibold uppercase tracking-[0.16em] text-white/50">Sitecore</span>
        <span className="block text-sm font-medium">People & Culture</span>
      </span>
    </Link>
  );
}

export function NavLinks({ stacked = false }: { stacked?: boolean }) {
  const pathname = usePathname();
  const needs = roster.filter((joiner) => joiner.health !== "on_track").length;

  return (
    <nav className={stacked ? "flex flex-1 flex-col gap-1" : "flex gap-1"} aria-label="People and Culture">
      {links.map((link) => {
        const active = current(pathname, link.href, link.exact);
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? "page" : undefined}
            className={`flex items-center justify-between gap-3 rounded-2xl px-3 py-2.5 text-sm ${
              active ? "bg-white/10 text-white" : "text-white/70 hover:bg-white/10 hover:text-white"
            }`}
          >
            <span>{link.label}</span>
            {link.href === "/admin/attention" ? (
              <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${active ? "bg-white text-pine" : "bg-red text-white"}`}>
                {needs}
              </span>
            ) : null}
          </Link>
        );
      })}
    </nav>
  );
}
