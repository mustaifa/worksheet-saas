"use client";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggle() {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {
      // localStorage unavailable (private browsing etc.) — theme just won't persist, not a big deal
    }
  }

  return (
    <button
      onClick={toggle}
      aria-label="Toggle dark mode"
      className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-base leading-none"
    >
      {isDark ? "☀️" : "🌙"}
    </button>
  );
}
