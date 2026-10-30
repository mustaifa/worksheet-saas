"use client";
import { usePathname, useRouter } from "next/navigation";
import { useGradeTheme } from "./GradeThemeProvider";
import { GRADE_THEMES, gradeFromPath, gradeTheme, validGrade } from "@/lib/gradeThemes";

export default function GradeThemeBar() {
  const { grade, setGrade } = useGradeTheme();
  const theme = gradeTheme(grade);
  const router = useRouter();
  const pathname = usePathname() || "/";

  function select(value: string) {
    const next = validGrade(value);
    setGrade(next);
    // Keep the visible worksheet grade consistent with the chosen grade.
    if (gradeFromPath(pathname) !== null) {
      const subject = pathname.split("/")[2];
      router.push(next === null ? `/worksheets/${subject}` : `/worksheets/${subject}/${next}`);
    }
  }

  // Keep sign-up and log-in focused on the form.
  if (pathname === "/signup" || pathname === "/login") return null;

  return (
    <section className={`grade-theme-bar print:hidden ${theme ? "is-themed" : ""}`} aria-label="Your learning theme">
      <div className="grade-theme-bar-inner">
        <div className="grade-theme-copy">
          <p className="grade-theme-eyebrow">{theme ? `YOUR GRADE ${grade} WORLD` : "MAKE IT YOURS"}</p>
          <p className="grade-theme-name" aria-live="polite" aria-atomic="true">{theme?.name || "A world for every learner"}</p>
          <p className="grade-theme-description">{theme?.description || "Choose a grade to discover its colours and creative world."}</p>
        </div>
        <div className="grade-theme-control">
          <label htmlFor="site-grade-theme">Your grade</label>
          <select id="site-grade-theme" value={grade ?? ""} onChange={e => select(e.target.value)}>
            <option value="">All grades · classic</option>
            {GRADE_THEMES.map(t => <option key={t.grade} value={t.grade}>Grade {t.grade} · {t.name}</option>)}
          </select>
        </div>
        {/* Decorative artwork: the theme name conveys its meaning in text. */}
        <img className="grade-theme-art" src={`/grade-themes/${grade ?? "classic"}.svg`} alt="" width="320" height="180" aria-hidden="true" />
      </div>
    </section>
  );
}
