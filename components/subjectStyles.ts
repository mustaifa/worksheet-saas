// Subject colour coding (kept in components/ so Tailwind sees the classes).
export const SUBJECT_STYLE: Record<string, { stripe: string; chip: string; text: string; soft: string; ring: string }> = {
  math: { stripe: "bg-blue-600", chip: "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300", text: "text-blue-700 dark:text-blue-300", soft: "bg-blue-50 dark:bg-blue-950/40", ring: "hover:border-blue-500" },
  english: { stripe: "bg-rose-600", chip: "bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300", text: "text-rose-700 dark:text-rose-300", soft: "bg-rose-50 dark:bg-rose-950/40", ring: "hover:border-rose-500" },
  science: { stripe: "bg-emerald-600", chip: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300", text: "text-emerald-700 dark:text-emerald-300", soft: "bg-emerald-50 dark:bg-emerald-950/40", ring: "hover:border-emerald-500" },
};
export const subjectStyle = (id: string) => SUBJECT_STYLE[id] || SUBJECT_STYLE.math;
