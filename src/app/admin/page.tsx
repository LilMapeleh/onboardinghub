import { Suspense } from "react";
import { LifecycleHub } from "@/components/admin/lifecycle/lifecycle-hub";

export default function HomePage() {
  return (
    <Suspense fallback={<p className="text-sm text-muted">Loading the lifecycle…</p>}>
      <LifecycleHub />
    </Suspense>
  );
}
