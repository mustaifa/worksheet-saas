"use client";
import { useState, useEffect } from "react";
import { Topic, groupTopics } from "@/lib/subjects";

export default function TopicPicker({
  topics, selected, onSelect, maxHeight = "18rem",
}: { topics: Topic[]; selected: string; onSelect: (id: string) => void; maxHeight?: string }) {
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
