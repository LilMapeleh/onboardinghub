"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { AppShell as AdminShell } from "@/components/admin/shell/app-shell";
import { AppShell } from "@/components/shell/app-shell";

export function ShellSwitch({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return <AdminShell>{children}</AdminShell>;
  return <AppShell>{children}</AppShell>;
}
