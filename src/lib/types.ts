export type TaskStatus = "not_started" | "in_progress" | "completed" | "waiting";

export type StageId =
  | "preboarding"
  | "first-day"
  | "explore"
  | "contribute"
  | "momentum"
  | "mark";

export type ArticleCategory = "stage" | "company" | "work" | "learning" | "questions";

export type EventKind = "session" | "one-to-one" | "setup" | "buddy" | "milestone";

export interface Stage {
  id: StageId;
  name: string;
  short: string;
  objective: string;
  fromDay: number;
  toDay: number;
  matters: string[];
  manager: string;
  note: string;
  inJourney: boolean;
}

export interface Task {
  id: string;
  title: string;
  why: string;
  steps: string[];
  stageId: StageId;
  opensOnDay: number;
  dueOnDay: number;
  completesOnDay: number;
  inProgressFromDay?: number;
  waitingUntilDay?: number;
  waitingNote?: string;
  system?: string;
  articleId?: string;
  with?: string;
  next?: string;
}

export interface Person {
  id: string;
  name: string;
  role: string;
  group: "close" | "support" | "team";
  location: string;
  helps: string;
  note?: string;
  noteFromDay?: number;
  initials: string;
  tone: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  day: number;
  start: string;
  end: string;
  who: string;
  where: string;
  detail: string;
  kind: EventKind;
}

export interface Article {
  id: string;
  title: string;
  summary: string;
  paragraphs: string[];
  category: ArticleCategory;
  stageId?: StageId;
  minutes: number;
}

export interface GlossaryEntry {
  term: string;
  meaning: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  requires: string[];
}

export interface Employee {
  firstName: string;
  name: string;
  role: string;
  department: string;
  team: string;
  location: string;
  manager: string;
  buddy: string;
  cohort: string;
  personalEmail: string;
  workEmail: string;
  offerAccepted: string;
}

export interface PreviewMoment {
  id: string;
  label: string;
  day: number;
}
