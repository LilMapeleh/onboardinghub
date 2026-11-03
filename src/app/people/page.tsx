import type { Metadata } from "next";
import { PeopleView } from "@/components/people/people-view";

export const metadata: Metadata = {
  title: "Your people",
};

export default function PeoplePage() {
  return <PeopleView />;
}
