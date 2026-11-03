"use client";

import { Suspense, type ReactNode } from "react";
import { JoinerProvider, useJoiner } from "@/components/joiner/joiner-context";
import { Sidebar, TopBar } from "@/components/shell/navigation";
import { TaskDrawer } from "@/components/tasks/task-drawer";
import { Button } from "@/components/ui/primitives";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <JoinerProvider>
      <div className="min-h-dvh lg:grid lg:grid-cols-[248px_minmax(0,1fr)] lg:gap-3 lg:p-3">
        <Suspense fallback={<div className="hidden rounded-[28px] bg-pine lg:block lg:h-[calc(100dvh-1.5rem)]" />}>
          <Sidebar />
        </Suspense>
        <div className="flex min-h-dvh min-w-0 flex-col overflow-x-hidden bg-paper lg:min-h-[calc(100dvh-1.5rem)] lg:overflow-hidden lg:rounded-[28px] lg:shadow-[0_24px_70px_-28px_rgba(40,10,80,0.55)]">
          <Suspense fallback={null}>
            <TopBar />
          </Suspense>
          <main className="mx-auto w-full max-w-[1180px] flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</main>
        </div>
      </div>
      <TaskDrawer />
      <ExternalNotice />
      <Toast />
    </JoinerProvider>
  );
}

function ExternalNotice() {
  const { external, showExternal } = useJoiner();
  if (!external) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-ink/40 p-4" onClick={() => showExternal(null)}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="external-title"
        className="w-full max-w-sm rounded-3xl bg-card p-6 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-red">Connected system</p>
        <h2 id="external-title" className="mt-2 font-display text-3xl">
          Opens in {external}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          This preview stays in the Hub. When {external} is connected, this goes straight there. If the work is finished in{" "}
          {external}, the task can update on its own. Until then, confirm it yourself.
        </p>
        <Button className="mt-5" onClick={() => showExternal(null)}>
          Stay in the Hub
        </Button>
      </div>
    </div>
  );
}

function Toast() {
  const { toast } = useJoiner();
  if (!toast) return null;
  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-full bg-pine px-4 py-2 text-sm text-white shadow-lg"
    >
      {toast}
    </div>
  );
}
