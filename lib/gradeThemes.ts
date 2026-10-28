export const GRADE_THEME_KEY = "practice-sheet-grade";

// Dark accent colours keep white button labels readable in every grade.
export const GRADE_THEMES = [
  { grade: 1, name: "Sunny Meadow", description: "Little discoveries, bright beginnings.", accent: "#a63e10", bright: "#fdba74", background: "#fff8eb", soft: "#fff0d6", dark: "#21180f", motif: "meadow" },
  { grade: 2, name: "Ocean Explorers", description: "A sea of things to discover.", accent: "#0e6580", bright: "#67e8f9", background: "#effcfd", soft: "#dff6fa", dark: "#0d2029", motif: "ocean" },
  { grade: 3, name: "Forest Friends", description: "Grow a little with every question.", accent: "#28643d", bright: "#86efac", background: "#f1faef", soft: "#e2f2dd", dark: "#122218", motif: "forest" },
  { grade: 4, name: "Cosmic Quest", description: "Big questions. New frontiers.", accent: "#7042a5", bright: "#d8b4fe", background: "#f8f3ff", soft: "#efe4ff", dark: "#21162f", motif: "space" },
  { grade: 5, name: "Desert Discovery", description: "Follow your curiosity further.", accent: "#934a23", bright: "#fdba74", background: "#fff7ef", soft: "#f9e8d5", dark: "#261b15", motif: "desert" },
  { grade: 6, name: "Mountain Makers", description: "Build confidence, one step at a time.", accent: "#096b66", bright: "#5eead4", background: "#effaf8", soft: "#d9f0ec", dark: "#102524", motif: "mountains" },
  { grade: 7, name: "Creative Studio", description: "Fresh ideas. Your own perspective.", accent: "#a33062", bright: "#f9a8d4", background: "#fff4f8", soft: "#fce4ee", dark: "#291824", motif: "studio" },
  { grade: 8, name: "Innovation Lab", description: "Connect ideas. Explore possibilities.", accent: "#255b9d", bright: "#93c5fd", background: "#f0f6ff", soft: "#e0ecfc", dark: "#142032", motif: "lab" },
  { grade: 9, name: "Blueprint", description: "Strong foundations for what comes next.", accent: "#3546a0", bright: "#a5b4fc", background: "#f3f5ff", soft: "#e5e9fc", dark: "#171d32", motif: "blueprint" },
  { grade: 10, name: "Aurora", description: "See patterns. Find your direction.", accent: "#176949", bright: "#6ee7b7", background: "#f0faf5", soft: "#ddf3e7", dark: "#10251e", motif: "aurora" },
  { grade: 11, name: "Orbital", description: "Deeper thinking. Wider horizons.", accent: "#5149a4", bright: "#c4b5fd", background: "#f6f4fe", soft: "#eae5fa", dark: "#1b192f", motif: "orbital" },
  { grade: 12, name: "Next Horizon", description: "Make room for your next chapter.", accent: "#76551b", bright: "#fcd34d", background: "#fbf8f0", soft: "#f2ead7", dark: "#232015", motif: "horizon" },
] as const;

export function validGrade(value: unknown): number | null {
  if (typeof value !== "string" && typeof value !== "number") return null;
  if (typeof value === "string" && !/^(?:[1-9]|1[0-2])$/.test(value)) return null;
  const grade = Number(value);
  return Number.isInteger(grade) && grade >= 1 && grade <= 12 ? grade : null;
}
export function gradeFromPath(pathname: string): number | null {
  const match = pathname.match(/^\/worksheets\/(?:math|english|science)\/(\d+)(?:\/|$)/);
  return match ? validGrade(match[1]) : null;
}
export function gradeTheme(grade: number | null) {
  return GRADE_THEMES.find(theme => theme.grade === grade);
}
