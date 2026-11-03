import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-lg">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-red">People & Culture</p>
      <h1 className="mt-2 font-display text-4xl text-ink">That profile is not in the Hub</h1>
      <p className="mt-3 text-muted">The lifecycle only lists joiners with an Onboarding Hub profile.</p>
      <Link href="/admin" className="mt-6 inline-flex rounded-full bg-red px-4 py-2 text-sm font-medium text-white hover:bg-red-dark">
        Back to the lifecycle
      </Link>
    </div>
  );
}
