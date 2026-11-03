import type { ReactNode } from "react";
import { formatLong } from "@/lib/admin/dates";
import { reviewDate } from "@/lib/admin/lifecycle";
import { Brand, NavLinks } from "@/components/admin/shell/nav";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-[248px_minmax(0,1fr)] lg:gap-3 lg:p-3">
      <aside className="sticky top-3 hidden h-[calc(100dvh-1.5rem)] flex-col rounded-[28px] bg-pine text-white lg:flex">
        <div className="px-5 py-6">
          <Brand />
        </div>
        <div className="px-3">
          <NavLinks stacked />
        </div>
        <p className="mt-auto px-5 py-6 text-xs leading-relaxed text-white/45">
          Profiles from the Onboarding Hub.
          <span className="mt-2 block text-white/70">{formatLong(reviewDate)}</span>
        </p>
      </aside>

      <div className="sticky top-0 z-30 border-b border-white/10 bg-pine text-white lg:hidden">
        <div className="px-4 py-3">
          <Brand />
        </div>
        <div className="overflow-x-auto px-3 pb-3">
          <NavLinks />
        </div>
      </div>

      <div className="flex min-h-dvh min-w-0 flex-col bg-paper lg:min-h-[calc(100dvh-1.5rem)] lg:rounded-[28px] lg:shadow-[0_24px_70px_-28px_rgba(40,10,80,0.55)]">
        <main className="mx-auto w-full max-w-[1180px] flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  );
}
