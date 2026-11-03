import type { Metadata } from "next";
import { JourneyView } from "@/components/journey/journey-view";

export const metadata: Metadata = {
  title: "Your journey",
};

export default function JourneyPage() {
  return <JourneyView />;
}
