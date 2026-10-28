import type { Metadata } from "next";
import AudiencePage, { AudienceConfig } from "@/components/AudiencePage";

export const metadata: Metadata = {
  title: "For Teachers — Worksheets, Live Quizzes & Answer Keys",
  description: "Make differentiated worksheets with correct answer keys in seconds, run live quizzes, and re-test with fresh versions. Math, English and Science, grades 1–12.",
  alternates: { canonical: "/teachers" },
};

const c: AudienceConfig = {
  audience: "teachers",
  eyebrow: "For teachers",
  title: "Practice, homework and re-tests — ready in a minute",
  intro:
    "Pick a grade and topic and get a printable worksheet with an answer key you can trust, because every answer is checked by code. Make an easy, medium and hard version for the same lesson, run a quick live quiz, or print a fresh copy for a re-test so nobody can copy last week's answers.",
  primaryCta: { label: "Make a worksheet", href: "/dashboard" },
  secondaryCta: { label: "Browse free worksheets", href: "/worksheets" },
  uses: [
    { title: "Differentiate in one click", body: "The same topic at easy, medium and hard difficulty, so every group in a mixed-ability class works at the right level — with matching answer keys.", href: "/dashboard", linkLabel: "Create a worksheet" },
    { title: "Bell-ringers and exit tickets", body: "Five questions on today's topic take seconds to make. Check understanding at the start or end of a lesson and plan tomorrow from the results.", href: "/blog/exit-tickets-that-work", linkLabel: "Exit ticket ideas" },
    { title: "Live quizzes without student accounts", body: "Students join on their own phones or laptops with a code — no sign-ups. Questions are marked automatically and you reveal answers together.", href: "/dashboard/live", linkLabel: "Start a live quiz" },
    { title: "Fresh copies for re-tests", body: "Generate a new version of any worksheet with different numbers and questions, so a re-test measures learning, not memory.", href: "/blog/differentiated-worksheets-mixed-ability-class", linkLabel: "How to differentiate" },
    { title: "Your own worksheets, cleaned up", body: "Type or draw a custom worksheet, or photograph a handwritten one and turn it into a clean PDF and Word document.", href: "/dashboard/custom-worksheet", linkLabel: "Build a custom worksheet" },
    { title: "Draw for the class", body: "Share a live whiteboard: students see your working on their screens as you explain it.", href: "/dashboard/whiteboard", linkLabel: "Open the whiteboard" },
  ],
  routine: {
    title: "A 10-minute weekly routine",
    steps: [
      "On Monday, make an easy, a medium and a hard worksheet for this week's main topic.",
      "Use five questions from the medium sheet as a bell-ringer on Tuesday to see who's ready for what.",
      "Hand out the right level for independent practice; students self-mark with the answer key.",
      "On Friday, run a 10-question live quiz on the topic and note who needs another go.",
      "Print a fresh version for anyone who needs a re-test next week.",
    ],
  },
  quickLinks: [
    { label: "Grade 3 Multiplication & Division", href: "/worksheets/math/3/multdiv" },
    { label: "Grade 5 Adding & Subtracting Fractions", href: "/worksheets/math/5/fractions_add_sub" },
    { label: "Grade 7 Percent Word Problems", href: "/worksheets/math/7/percent_word_problems" },
    { label: "Grade 8 Sentence Structure", href: "/worksheets/english/8/sentence_types" },
    { label: "Grade 9 Literary Devices", href: "/worksheets/english/9/literary_devices" },
    { label: "Grade 6 Circulatory System", href: "/worksheets/science/6/body_circulatory" },
  ],
  faqs: [
    { q: "Are the answer keys really correct?", a: "Yes. Math questions and answers are produced together by code, and English and Science questions come from reviewed question banks. Nothing is guessed by an AI model." },
    { q: "Do my students need accounts?", a: "No. Students join live quizzes and whiteboards with a code. Only the teacher needs an account to create worksheets." },
    { q: "Can I print in A4 or US Letter?", a: "Yes. Use Print or Save as PDF; worksheets are laid out to fit both sizes, with the answer key on its own page." },
    { q: "Which grades and subjects are covered?", a: "Math, English and Science for grades 1–12 — more than a hundred topics, each at three difficulty levels." },
  ],
};

export default function TeachersPage() {
  return <AudiencePage c={c} />;
}
