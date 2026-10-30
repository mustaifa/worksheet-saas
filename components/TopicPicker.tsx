"use client";
import { useState, useEffect, useMemo } from "react";
import { Topic, SubjectId, groupTopics } from "@/lib/subjects";
import { bookFor, pruneBook, LEVEL_LABEL, LEVEL_BADGE, type Unit } from "@/lib/curriculum";

/**
 * Topic chooser. When the subject has a curriculum book for this grade, it
 * renders the book as a tree — Unit → Lesson → Skill — so a teacher can go
 * straight to the exact skill taught today. Otherwise it falls back to the
 * flat list grouped by `group`.
 */
export default function TopicPicker({
  topics, selected, onSelect, maxHeight = "18rem", subject, grade,
}: {
  topics: Topic[];
  selected: string;
  onSelect: (id: string) => void;
  maxHeight?: string;
  subject?: SubjectId;
  grade?: number;
}) {
  const book = useMemo(() => {
    if (!subject || !grade) return null;
    const units = bookFor(subject, grade);
    return units ? pruneBook(units, new Set(topics.map((t) => t.id))) : null;
  }, [subject, grade, topics]);

  if (book && book.length) return <BookTree units={book} topics={topics} selected={selected} onSelect={onSelect} maxHeight={maxHeight} />;
  return <FlatPicker topics={topics} selected={selected} onSelect={onSelect} maxHeight={maxHeight} />;
}

function BookTree({ units, topics, selected, onSelect, maxHeight }: {
  units: Unit[]; topics: Topic[]; selected: string; onSelect: (id: string) => void; maxHeight: string;
}) {
  const byId = useMemo(() => new Map(topics.map((t) => [t.id, t])), [topics]);
  const unitOf = (id: string) => units.findIndex((u) => u.lessons.some((l) => l.skills.some((s) => s.topic === id)));
  const [openUnit, setOpenUnit] = useState<number>(() => Math.max(0, unitOf(selected)));
  const [query, setQuery] = useState("");

  // follow the selection when it changes from outside (grade switch, command box)
  useEffect(() => { const i = unitOf(selected); if (i >= 0) setOpenUnit(i); }, [selected, units]); // eslint-disable-line react-hooks/exhaustive-deps

  const q = query.trim().toLowerCase();
  const matches = (id: string) => {
    if (!q) return true;
    const t = byId.get(id);
    return !!t && (t.label.toLowerCase().includes(q) || t.aliases.some((a) => a.includes(q)));
  };

  return (
    <div>
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Find a topic (e.g. fractions, time)…"
        aria-label="Find a topic"
        className="w-full mb-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-slate-900 dark:text-white placeholder:text-slate-400"
      />
      <div className="overflow-y-auto pr-1 space-y-1.5" style={{ maxHeight }}>
        {units.map((unit, ui) => {
          const lessons = unit.lessons
            .map((l) => ({ ...l, skills: l.skills.filter((s) => matches(s.topic)) }))
            .filter((l) => l.skills.length > 0);
          if (q && lessons.length === 0) return null;
          const isOpen = !!q || openUnit === ui;
          const hasSelection = unit.lessons.some((l) => l.skills.some((s) => s.topic === selected));
          const count = unit.lessons.reduce((n, l) => n + l.skills.length, 0);
          return (
            <div key={ui} className={`rounded-lg border ${hasSelection ? "border-slate-900 dark:border-white" : "border-slate-200 dark:border-slate-700"} overflow-hidden`}>
              <button
                onClick={() => setOpenUnit(isOpen && !q ? -1 : ui)}
                aria-expanded={isOpen}
                className={`w-full flex items-center justify-between gap-2 px-3 py-2 text-xs text-left ${hasSelection ? "bg-slate-100 dark:bg-slate-800" : ""}`}
              >
                <span className="min-w-0">
                  <span className="block font-semibold text-slate-900 dark:text-white">Unit {ui + 1} · {unit.title}</span>
                  {unit.domain && <span className="block text-[11px] text-slate-500 dark:text-slate-400 truncate">{unit.domain}</span>}
                </span>
                <span className="flex items-center gap-1.5 shrink-0 text-slate-400">
                  <span className="text-[11px]">{count}</span>
                  <span className={`transition-transform ${isOpen ? "rotate-90" : ""}`}>›</span>
                </span>
              </button>
              {isOpen && (
                <div className="px-1.5 pb-1.5 bg-white dark:bg-slate-900 space-y-2">
                  {lessons.map((lesson) => (
                    <div key={lesson.title}>
                      <p className="px-1.5 pt-1.5 pb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{lesson.title}</p>
                      <div className="space-y-1">
                        {lesson.skills.map((s) => {
                          const t = byId.get(s.topic);
                          if (!t) return null;
                          const level = s.level ?? "core";
                          return (
                            <button
                              key={s.topic}
                              onClick={() => onSelect(s.topic)}
                              aria-pressed={selected === s.topic}
                              className={`w-full flex items-center justify-between gap-2 text-xs rounded-md border px-2.5 py-1.5 text-left ${
                                selected === s.topic
                                  ? "border-slate-900 dark:border-white bg-slate-100 dark:bg-slate-800 font-medium text-slate-900 dark:text-white"
                                  : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-400"
                              }`}
                            >
                              <span className="min-w-0">{t.label}</span>
                              <span className="flex items-center gap-1 shrink-0">
                                {level !== "core" && <span className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${LEVEL_BADGE[level]}`}>{LEVEL_LABEL[level]}</span>}
                                {s.std && <span className="text-[10px] text-slate-400 font-mono">{s.std}</span>}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
        {q && !units.some((u) => u.lessons.some((l) => l.skills.some((s) => matches(s.topic)))) && (
          <p className="text-xs text-slate-400 dark:text-slate-500 px-1">No topic matches “{query}” in this grade.</p>
        )}
      </div>
    </div>
  );
}

function FlatPicker({ topics, selected, onSelect, maxHeight }: { topics: Topic[]; selected: string; onSelect: (id: string) => void; maxHeight: string }) {
  const grouped = groupTopics(topics);
  const selectedGroup = grouped.find((g) => g.topics.some((t) => t.id === selected))?.group ?? null;
  const [openGroup, setOpenGroup] = useState<string | null>(selectedGroup);

  // keep the containing group open if the selected topic changes from outside
  // (e.g. switching grade auto-picks a new default topic)
  useEffect(() => { setOpenGroup(selectedGroup); }, [selected]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="overflow-y-auto pr-1 space-y-1.5" style={{ maxHeight }}>
      {grouped.map(({ group, topics: groupTopicsList }) => {
        // ungrouped topics render as plain standalone buttons, no accordion needed
        if (!group) {
          return groupTopicsList.map((t) => (
            <button
              key={t.id}
              onClick={() => onSelect(t.id)}
              className={`w-full text-xs rounded-lg border px-3 py-2 text-left ${
                selected === t.id
                  ? "border-slate-900 dark:border-white bg-slate-100 dark:bg-slate-800 font-medium text-slate-900 dark:text-white"
                  : "border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300"
              }`}
            >
              {t.label}
            </button>
          ));
        }

        const isOpen = openGroup === group;
        const hasSelection = groupTopicsList.some((t) => t.id === selected);

        return (
          <div key={group} className={`rounded-lg border ${hasSelection ? "border-slate-900 dark:border-white" : "border-slate-200 dark:border-slate-700"} overflow-hidden`}>
            <button
              onClick={() => setOpenGroup(isOpen ? null : group)}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-left ${
                hasSelection ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white" : "text-slate-700 dark:text-slate-300"
              }`}
            >
              <span>{group} <span className="text-slate-400 font-normal">({groupTopicsList.length})</span></span>
              <span className={`transition-transform ${isOpen ? "rotate-90" : ""}`}>›</span>
            </button>
            {isOpen && (
              <div className="grid grid-cols-2 gap-1.5 p-1.5 pt-0 bg-white dark:bg-slate-900">
                {groupTopicsList.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => onSelect(t.id)}
                    className={`text-xs rounded-lg border px-2 py-1.5 text-left ${
                      selected === t.id
                        ? "border-slate-900 dark:border-white bg-slate-100 dark:bg-slate-800 font-medium text-slate-900 dark:text-white"
                        : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        );
      })}
      {topics.length === 0 && (
        <p className="text-xs text-slate-400 dark:text-slate-500">No topics yet for this grade — try another.</p>
      )}
    </div>
  );
}
