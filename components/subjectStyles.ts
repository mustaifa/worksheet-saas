// Subject colour coding (kept in components/ so Tailwind sees the classes).
export const SUBJECT_STYLE: Record<string, { stripe: string; chip: string; text: string; soft: string; ring: string }> = {
  math: { stripe: "bg-blue-600", chip: "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300", text: "text-blue-700 dark:text-blue-300", soft: "bg-blue-50 dark:bg-blue-950/40", ring: "hover:border-blue-500" },
  english: { stripe: "bg-rose-600", chip: "bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300", text: "text-rose-700 dark:text-rose-300", soft: "bg-rose-50 dark:bg-rose-950/40", ring: "hover:border-rose-500" },
  science: { stripe: "bg-emerald-600", chip: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300", text: "text-emerald-700 dark:text-emerald-300", soft: "bg-emerald-50 dark:bg-emerald-950/40", ring: "hover:border-emerald-500" },
  physics: { stripe: "bg-indigo-600", chip: "bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300", text: "text-indigo-700 dark:text-indigo-300", soft: "bg-indigo-50 dark:bg-indigo-950/40", ring: "hover:border-indigo-500" },
  chemistry: { stripe: "bg-orange-600", chip: "bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-300", text: "text-orange-700 dark:text-orange-300", soft: "bg-orange-50 dark:bg-orange-950/40", ring: "hover:border-orange-500" },
  biology: { stripe: "bg-teal-600", chip: "bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-300", text: "text-teal-700 dark:text-teal-300", soft: "bg-teal-50 dark:bg-teal-950/40", ring: "hover:border-teal-500" },
  computer: { stripe: "bg-violet-600", chip: "bg-violet-50 text-violet-700 dark:bg-violet-950 dark:text-violet-300", text: "text-violet-700 dark:text-violet-300", soft: "bg-violet-50 dark:bg-violet-950/40", ring: "hover:border-violet-500" },
};
export const subjectStyle = (id: string) => SUBJECT_STYLE[id] || SUBJECT_STYLE.math;
