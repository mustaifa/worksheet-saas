import type { Metadata } from "next";
import AudiencePage, { AudienceConfig } from "@/components/AudiencePage";

export const metadata: Metadata = {
  title: "For Parents — Practice at Home with Answer Keys",
  description: "Short, grade-level practice your child can do at home, with answer keys so you can check work in seconds. Family challenges and rewards included.",
  alternates: { canonical: "/parents" },
};

const c: AudienceConfig = {
  audience: "parents",
  eyebrow: "For parents",
  title: "Help your child practise at home — without being a teacher",
  intro:
    "Find the topic your child is learning at school, print a short worksheet, and check it with the answer key. No guesswork about what to practise or whether the answers are right. Set up family challenges with rewards to keep practice fun.",
  primaryCta: { label: "Set up family practice", href: "/dashboard/family" },
  secondaryCta: { label: "Find your child's grade", href: "/worksheets" },
  uses: [
    { title: "Practice that matches school", body: "Choose the subject, grade and topic from your child's homework or report, and get a worksheet at the right level in seconds.", href: "/worksheets", linkLabel: "Browse by grade" },
    { title: "Check answers in seconds", body: "Every worksheet comes with an answer key, so you can mark work quickly and focus on the questions your child got wrong.", href: "/blog/help-child-with-math-homework", linkLabel: "How to help without taking over" },
    { title: "Family challenges and rewards", body: "Create a profile for each child, set a challenge, and choose rewards for doing well. Profiles are protected with a PIN.", href: "/dashboard/family", linkLabel: "Open Family" },
    { title: "Stop the summer slide", body: "Ten minutes a day over the holidays keeps skills fresh for the new school year.", href: "/blog/prevent-summer-learning-loss", linkLabel: "A simple holiday plan" },
    { title: "Homework help that explains", body: "When your child is stuck on a problem, the homework helper walks through the steps instead of just giving the answer.", href: "/dashboard/tutor", linkLabel: "Try homework help" },
    { title: "Know what's taught when", body: "A plain-English guide to the topics usually covered in each grade, so you know where to focus.", href: "/blog/grade-by-grade-guide-to-math-topics", linkLabel: "Grade-by-grade guide" },
  ],
  routine: {
    title: "A 15-minute daily routine that works",
    steps: [
      "Pick one topic your child is working on at school this week.",
      "Print a 5–10 question worksheet at easy or medium difficulty.",
      "Let them work on their own for 10 minutes, at the same time each day.",
      "Mark it together with the answer key and talk through one mistake.",
      "Celebrate the streak, not the score — consistency is what builds skills.",
    ],
  },
  quickLinks: [
    { label: "Grade 1 Addition & Subtraction", href: "/worksheets/math/1/addsub" },
    { label: "Grade 2 Sight Words", href: "/worksheets/english/2/sight_words" },
    { label: "Grade 3 Multiplication & Division", href: "/worksheets/math/3/multdiv" },
    { label: "Grade 4 Spelling", href: "/worksheets/english/4/spelling" },
    { label: "Grade 5 Fractions (Mixed)", href: "/worksheets/math/5/fractions" },
    { label: "Grade 6 Ratios & Rates", href: "/worksheets/math/6/ratios" },
  ],
  faqs: [
    { q: "How much practice is enough?", a: "Short and regular beats long and occasional. Ten to fifteen focused minutes a day, a few days a week, is plenty for most children." },
    { q: "What if my child finds it too hard?", a: "Drop to the easy level or the grade below for a week. Building confidence on the basics usually makes the harder work click." },
    { q: "Is it safe for my child to use?", a: "Children practise through a parent's account and PIN-protected family profiles. We don't ask children for personal information." },
    { q: "Do I need to print?", a: "No — your child can write answers on paper while reading the worksheet on a screen. Printing just makes it easier." },
  ],
};

export default function ParentsPage() {
  return <AudiencePage c={c} />;
}
