"use client";
import GradeThemeProvider from "./GradeThemeProvider";
import { SessionProvider } from "next-auth/react";

export default function Providers({ children }: { children: React.ReactNode }) {
  return <SessionProvider><GradeThemeProvider>{children}</GradeThemeProvider></SessionProvider>;
}
