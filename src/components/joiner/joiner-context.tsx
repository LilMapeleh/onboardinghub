"use client";

import { useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { articles, badges, employee, people, PREVIEWS } from "@/lib/content";
import { dateForDay } from "@/lib/dates";
import {
  badgeViews,
  earnedKey,
  eventViews,
  eventWhen,
  notices,
  stageForDay,
  taskViews,
  type BadgeView,
  type EventView,
  type Notice,
  type Overrides,
  type TaskView,
} from "@/lib/selectors";
import type { Article, Employee, Person, Stage, TaskStatus } from "@/lib/types";

export interface CultureAnswers {
  choice: string;
  help: string;
  hope: string;
}

interface JoinerContextValue {
  employee: Employee;
  people: Person[];
  articles: Article[];
  day: number;
  date: string;
  previewId: string;
  setPreview: (id: string) => void;
  stage: Stage;
  tasks: TaskView[];
  schedule: EventView[];
  badges: BadgeView[];
  notices: Notice[];
  openTaskId: string | null;
  openTask: (id: string | null) => void;
  setTaskStatus: (id: string, status: TaskStatus) => void;
  overrides: Overrides;
  culture: CultureAnswers;
  setCulture: (next: CultureAnswers) => void;
  cultureError: string | null;
  submitCulture: () => void;
  articleId: string | null;
  openArticle: (id: string | null) => void;
  external: string | null;
  showExternal: (system: string | null) => void;
  toast: string | null;
  eventWhen: (event: EventView) => string;
  query: string;
  setQuery: (value: string) => void;
}

const JoinerContext = createContext<JoinerContextValue | null>(null);

export function JoinerProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [previewId, setPreviewId] = useState("today");
  const [overrides, setOverrides] = useState<Overrides>({});
  const [openTaskId, setOpenTaskId] = useState<string | null>(null);
  const [articleId, setArticleId] = useState<string | null>(null);
  const [external, setExternal] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [culture, setCulture] = useState<CultureAnswers>({ choice: "", help: "", hope: "" });
  const [cultureError, setCultureError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const earnedSeen = useRef<string | null>(null);

  const preview = PREVIEWS.find((item) => item.id === previewId) ?? PREVIEWS[2];
  const day = preview.day;
  const date = dateForDay(day);
  const stage = stageForDay(day);
  const tasks = useMemo(() => taskViews(day, overrides), [day, overrides]);
  const schedule = useMemo(() => eventViews(), []);
  const badgeList = useMemo(() => badgeViews(day, overrides), [day, overrides]);
  const noticeList = useMemo(() => notices(day, tasks, schedule), [day, tasks, schedule]);
  const key = earnedKey(day, overrides);

  useEffect(() => {
    if (earnedSeen.current === null) {
      earnedSeen.current = key;
      return;
    }
    if (earnedSeen.current === key) return;
    const previous = new Set(earnedSeen.current.split("|").filter(Boolean));
    earnedSeen.current = key;
    const fresh = key.split("|").filter(Boolean).find((id) => !previous.has(id));
    const badge = badges.find((item) => item.id === fresh);
    if (badge) setToast(`Badge earned · ${badge.name}`);
  }, [key]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 3400);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const setPreview = useCallback((id: string) => {
    earnedSeen.current = null;
    setPreviewId(id);
    setOverrides({});
    setCulture({ choice: "", help: "", hope: "" });
    setCultureError(null);
    setOpenTaskId(null);
    setArticleId(null);
    setExternal(null);
    setQuery("");
  }, []);

  const setTaskStatus = useCallback((id: string, status: TaskStatus) => {
    setOverrides((current) => ({ ...current, [id]: status }));
  }, []);

  const submitCulture = useCallback(() => {
    if (!culture.choice) {
      setCultureError("Choose the sentence that fits Sitecore.");
      return;
    }
    if (culture.choice !== "experiences") {
      setCultureError("Sitecore’s work is digital experiences. The other two belong to different systems.");
      return;
    }
    if (culture.help.trim().length < 8 || culture.hope.trim().length < 8) {
      setCultureError("Add a sentence or two on the last two prompts.");
      return;
    }
    setCultureError(null);
    setTaskStatus("culture", "completed");
  }, [culture, setTaskStatus]);

  const openArticle = useCallback(
    (id: string | null) => {
      setArticleId(id);
      setOpenTaskId(null);
      if (id) router.push("/explore");
    },
    [router],
  );

  const value: JoinerContextValue = {
    employee,
    people,
    articles,
    day,
    date,
    previewId,
    setPreview,
    stage,
    tasks,
    schedule,
    badges: badgeList,
    notices: noticeList,
    openTaskId,
    openTask: setOpenTaskId,
    setTaskStatus,
    overrides,
    culture,
    setCulture,
    cultureError,
    submitCulture,
    articleId,
    openArticle,
    external,
    showExternal: setExternal,
    toast,
    eventWhen: (event) => eventWhen(event, day),
    query,
    setQuery,
  };

  return <JoinerContext.Provider value={value}>{children}</JoinerContext.Provider>;
}

export function useJoiner(): JoinerContextValue {
  const value = useContext(JoinerContext);
  if (!value) throw new Error("useJoiner must be used within JoinerProvider");
  return value;
}
