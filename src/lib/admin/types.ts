export type Health = "on_track" | "attention" | "blocked";

export type SignalStatus = "done" | "upcoming" | "open" | "in_progress" | "waiting" | "overdue" | "blocked";

export type OwnerKind = "manager" | "buddy" | "hr" | "it" | "workplace" | "experience" | "joiner";

export type Arrangement = "Office" | "Hybrid" | "Remote";

export type ClassKind = "First Monday" | "Third Monday" | "Exception";

export type PhaseId =
  | "soon"
  | "first-day"
  | "explore"
  | "day30"
  | "momentum"
  | "day60"
  | "mark"
  | "day90"
  | "closed";

export type MilestoneId = "day1" | "week1" | "day30" | "day60" | "day90";

export interface SignalDef {
  id: string;
  title: string;
  ownerKind: OwnerKind;
  system?: string;
  opensOnDay: number;
  dueOnDay: number;
  completesOnDay: number;
  inProgressFromDay?: number;
  milestone?: MilestoneId;
}

export interface Hold {
  id: string;
  kind: "blocked" | "waiting" | "open";
  note: string;
  untilDay?: number;
  expected?: string;
}

export interface Support {
  hr: string;
  it: string;
  workplace: string;
  experience: string;
}

export interface JoinerSeed {
  id: string;
  live: boolean;
  firstName: string;
  name: string;
  role: string;
  department: string;
  team: string;
  location: string;
  arrangement: Arrangement;
  manager: string;
  buddy: string;
  cohort: string;
  classKind: ClassKind;
  personalEmail: string;
  workEmail: string;
  offerAccepted: string;
  startDate: string;
  initials: string;
  tone: string;
  support: Support;
  titles?: Partial<Record<string, string>>;
  notes?: Partial<Record<string, string>>;
  holds?: Hold[];
  extras?: SignalDef[];
}

export interface Phase {
  id: PhaseId;
  label: string;
  short: string;
  from: number;
  to: number;
  objective: string;
  watch: string;
}

export interface SignalView {
  id: string;
  title: string;
  owner: string;
  ownerKind: OwnerKind;
  system?: string;
  opensOnDay: number;
  dueOnDay: number;
  completesOnDay: number;
  milestone?: MilestoneId;
  status: SignalStatus;
  detail: string;
  expected?: string;
  note?: string;
}

export interface MilestoneView {
  id: MilestoneId;
  label: string;
  day: number;
  status: "done" | "upcoming" | "now" | "due" | "overdue" | "blocked";
}

export interface BadgeView {
  id: string;
  name: string;
  earned: boolean;
}

export interface JoinerView {
  id: string;
  live: boolean;
  firstName: string;
  name: string;
  role: string;
  department: string;
  team: string;
  location: string;
  arrangement: Arrangement;
  manager: string;
  buddy: string;
  cohort: string;
  classKind: ClassKind;
  personalEmail: string;
  workEmail: string;
  offerAccepted: string;
  startDate: string;
  initials: string;
  tone: string;
  support: Support;
  day: number;
  phase: Phase;
  health: Health;
  approaching: "Day 30" | "Day 60" | "Day 90" | null;
  signals: SignalView[];
  milestones: MilestoneView[];
  badges: BadgeView[];
  next: SignalView | null;
  concern: MilestoneView | null;
}
