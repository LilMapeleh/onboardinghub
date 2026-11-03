import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: {
    default: "People & Culture",
    template: "%s · People & Culture",
  },
  description: "Monitor every new joiner from Day 1 to Day 90. Profiles come from the Onboarding Hub.",
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return children;
}
