"use client";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { GRADE_THEME_KEY, gradeFromPath, validGrade } from "@/lib/gradeThemes";

type GradeThemeState = { grade: number | null; ready: boolean; setGrade: (grade: number | null) => void };
const GradeThemeContext = createContext<GradeThemeState | null>(null);

export default function GradeThemeProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "/";
  const [grade, updateGrade] = useState<number | null>(null);
  const [ready, setReady] = useState(false);
  const setGrade = useCallback((value: number | null) => {
    const next = validGrade(value);
    updateGrade(next);
    if (next === null) delete document.documentElement.dataset.grade;
    else document.documentElement.dataset.grade = String(next);
    try {
      if (next === null) localStorage.removeItem(GRADE_THEME_KEY);
      else localStorage.setItem(GRADE_THEME_KEY, String(next));
    } catch { /* The theme still works when browser storage is unavailable. */ }
  }, []);

  useEffect(() => {
    let saved: number | null = null;
    try { saved = validGrade(localStorage.getItem(GRADE_THEME_KEY)); } catch { /* optional storage */ }
    setGrade(gradeFromPath(window.location.pathname) ?? saved);
    setReady(true);
  }, [setGrade]);

  useEffect(() => {
    const routeGrade = gradeFromPath(pathname);
    if (routeGrade !== null) setGrade(routeGrade);
  }, [pathname, setGrade]);

  return <GradeThemeContext.Provider value={{ grade, ready, setGrade }}>{children}</GradeThemeContext.Provider>;
}

export function useGradeTheme() {
  const context = useContext(GradeThemeContext);
  if (!context) throw new Error("useGradeTheme requires GradeThemeProvider");
  return context;
}
