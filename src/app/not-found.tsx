import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-lg py-16">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-red">Onboarding Hub</p>
      <h1 className="mt-3 font-display text-5xl">That page is not part of the journey.</h1>
      <Link href="/" className="mt-6 inline-block text-sm font-medium underline underline-offset-4">
        Back home
      </Link>
    </div>
  );
}
