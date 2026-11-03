"use client";

import { useState } from "react";
import { glossary } from "@/lib/content";
import { useJoiner } from "@/components/joiner/joiner-context";
import { PageIntro, card } from "@/components/ui/primitives";
import type { Article, ArticleCategory } from "@/lib/types";

const categories: { id: ArticleCategory | "glossary"; label: string }[] = [
  { id: "stage", label: "For now" },
  { id: "company", label: "Company" },
  { id: "work", label: "How we work" },
  { id: "learning", label: "Learning" },
  { id: "questions", label: "Questions" },
  { id: "glossary", label: "Words we use" },
];

export function ExploreView() {
  const { articles, stage, articleId, openArticle } = useJoiner();
  const [category, setCategory] = useState<(typeof categories)[number]["id"]>("stage");
  const [query, setQuery] = useState("");
  const selected = articles.find((article) => article.id === articleId);

  if (selected) {
    return <Reader article={selected} onBack={() => openArticle(null)} />;
  }

  const listed =
    category === "glossary"
      ? []
      : articles.filter((article) =>
          category === "stage" ? article.category === "stage" && article.stageId === stage.id : article.category === category,
        );

  const words = glossary.filter((entry) => {
    const haystack = `${entry.term} ${entry.meaning}`.toLowerCase();
    return haystack.includes(query.trim().toLowerCase());
  });

  return (
    <div>
      <PageIntro
        eyebrow="Explore"
        title="Short, and timed."
        lede="The useful version of the documents, at the moment you need them. Courses stay in Docebo. Surveys stay in Peakon. This is the map."
      />
      <div className="mb-6 flex gap-2 overflow-x-auto">
        {categories.map((item) => (
          <button
            key={item.id}
            type="button"
            aria-pressed={category === item.id}
            onClick={() => setCategory(item.id)}
            className={`shrink-0 rounded-full px-3 py-1.5 text-sm ${
              category === item.id ? "bg-pine text-white" : "bg-card text-ink ring-1 ring-line"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
      {category === "glossary" ? (
        <div>
          <label className="mb-4 block max-w-sm text-sm">
            <span className="sr-only">Search words</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search words"
              className="w-full rounded-2xl border border-line bg-card px-4 py-2.5"
            />
          </label>
          <dl className="grid gap-3 sm:grid-cols-2">
            {words.map((entry) => (
              <div key={entry.term} className={`${card} p-4`}>
                <dt className="font-medium">{entry.term}</dt>
                <dd className="mt-1 text-sm leading-relaxed text-muted">{entry.meaning}</dd>
              </div>
            ))}
          </dl>
          {words.length === 0 ? <p className="text-sm text-muted">No matches.</p> : null}
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {listed.map((article) => (
            <button key={article.id} type="button" onClick={() => openArticle(article.id)} className={`${card} p-5 text-left`}>
              <span className="text-xs text-muted">{article.minutes} min</span>
              <span className="mt-2 block font-display text-2xl leading-tight">{article.title}</span>
              <span className="mt-2 block text-sm leading-relaxed text-muted">{article.summary}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function Reader({ article, onBack }: { article: Article; onBack: () => void }) {
  return (
    <article className="mx-auto max-w-2xl">
      <button type="button" onClick={onBack} className="text-sm font-medium text-muted">
        Back to Explore
      </button>
      <p className="mt-6 text-xs font-semibold uppercase tracking-[0.14em] text-red">{article.minutes} minute read</p>
      <h1 className="mt-2 font-display text-5xl leading-tight">{article.title}</h1>
      <p className="mt-4 text-lg leading-relaxed text-muted">{article.summary}</p>
      <div className="mt-8 space-y-4">
        {article.paragraphs.map((paragraph) => (
          <p key={paragraph} className="text-base leading-relaxed">
            {paragraph}
          </p>
        ))}
      </div>
    </article>
  );
}
