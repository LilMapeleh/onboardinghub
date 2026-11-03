import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Dossier } from "@/components/admin/joiner/dossier";
import { getJoiner, roster } from "@/lib/admin/lifecycle";

export function generateStaticParams() {
  return roster.map((joiner) => ({ id: joiner.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const joiner = getJoiner(id);
  return { title: joiner?.name ?? "Joiner" };
}

export default async function JoinerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const joiner = getJoiner(id);
  if (!joiner) notFound();
  return <Dossier joiner={joiner} mode="full" />;
}
