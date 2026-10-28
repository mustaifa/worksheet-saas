import type { Metadata } from "next";
import AudiencePage, { AudienceConfig } from "@/components/AudiencePage";

export const metadata: Metadata = {
  title: "For Students — Practise, Check Your Answers, Get Better",
  description: "Free practice worksheets with answer keys for every grade, plus study guides on how to revise for tests. Math, English and Science, grades 1–12.",
  alternates: { canonical: "/students" },
};

const c: AudienceConfig = {
  audience: "students",
  eyebrow: "For students",
  title: "Practise the topics you're stuck on — and check your own answers",
  intro:
    "Find your grade and topic, try the questions, then check them with the answer key. When you're preparing for a test, practise a little every day instead of cramming the night before — it works much better.",
  primaryCta: { label: "Find a worksheet", href: "/worksheets" },
  secondaryCta: { label: "How to study for a test", href: "/blog/how-to-study-for-a-test" },
  uses: [
    { title: "Practise before a test", body: "Try a worksheet on each topic in the test. The ones you get wrong tell you exactly what to revise.", href: "/blog/how-to-study-for-a-test", linkLabel: "A study plan that works" },
    { title: "Check your own work", body: "Every worksheet has an answer key. Cover it, try the questions, then mark them yourself and fix your mistakes.", href: "/worksheets", linkLabel: "Browse worksheets" },
    { title: "Learn it step by step", body: "Our guides explain topics like fractions, sentence structure and Punnett squares with worked examples.", href: "/blog?for=students", linkLabel: "Read the guides" },
    { title: "Join a class quiz", body: "If your teacher runs a live quiz, enter the code to join from your phone or laptop — no account needed.", href: "/play", linkLabel: "Join with a code" },
  ],
  routine: {
    title: "Getting ready for a test",
    steps: [
      "List the topics that will be on the test.",
      "Do one short worksheet per topic, without looking at notes.",
      "Mark it with the answer key and circle what you got wrong.",
      "Re-learn those parts, then try a fresh worksheet on them a day or two later.",
      "The night before, do a quick mixed set — then sleep.",
    ],
  },
  quickLinks: [
    { label: "Grade 6 Order of Operations", href: "/worksheets/math/6/order" },
    { label: "Grade 7 Proportions", href: "/worksheets/math/7/proportions" },
    { label: "Grade 8 Pythagorean Theorem", href: "/worksheets/math/8/pythagorean" },
    { label: "Grade 9 Literary Devices", href: "/worksheets/english/9/literary_devices" },
    { label: "Grade 10 Punnett Squares", href: "/worksheets/science/10/genetics_punnett" },
    { label: "Grade 10 Quadratic Formula", href: "/worksheets/math/10/quadratic_formula" },
  ],
  faqs: [
    { q: "Do I need an account?", a: "No. Every worksheet on this site is free to view and print with its answer key. You only need a code to join your teacher's live quiz." },
    { q: "I'm in elementary school. Can I use it?", a: "Yes! Ask a parent or teacher to help you find your worksheets — parents can set up a family profile for you." },
    { q: "Is it cheating to look at the answer key?", a: "Not if you try the questions first. Checking your own answers and fixing mistakes is one of the best ways to learn." },
  ],
};

export default function StudentsPage() {
  return <AudiencePage c={c} />;
}
