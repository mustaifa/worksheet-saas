import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { BRAND } from "@/lib/brand";

export const metadata = { title: "Privacy Policy", alternates: { canonical: "/privacy" } };

const SECTIONS: { h: string; p: (string | JSX.Element)[] }[] = [
  {
    h: "Who we are",
    p: [`Practice Sheet (${BRAND.domain}) is a product of ${BRAND.company}. You can contact us about privacy at any time at ${BRAND.contactEmail}.`],
  },
  {
    h: "What we collect",
    p: [
      "Account details: when a teacher, tutor or parent creates an account, we store their name, email address and a securely hashed password (we never store plain-text passwords). If you sign in with Google, we receive your name and email address from Google.",
      "Family profiles: parents can create profiles for their children inside their own account. A profile holds a first name or nickname, an avatar, a default grade, an optional 4-digit PIN, and the child's challenge scores and rewards.",
      "Live quizzes and whiteboards: when someone joins with a code, we store the nickname they type and their answers or drawings for that session.",
      "Custom and scanned worksheets: worksheets you create, and photos you upload to convert into worksheets, are saved to your account so you can reopen, download or share them.",
      "Homework helper messages, topic requests and contact messages: the text you send us, and an email address only if you choose to include one.",
      "Usage counts: we keep simple daily counters (for example, how many homework-helper messages were used) to apply fair-use limits.",
    ],
  },
  {
    h: "What we don't collect",
    p: [
      "Worksheets you generate and print are created on the fly; we don't keep a history of them. We do not show ads, we do not sell or rent personal information, and we do not build advertising profiles.",
    ],
  },
  {
    h: "How we use information",
    p: ["To run your account and its features, provide the homework helper and worksheet scanner, process subscriptions, send account and billing emails, apply fair-use limits, keep the service secure, and reply to you."],
  },
  {
    h: "Service providers",
    p: [
      "We use a small number of providers to run Practice Sheet, each under its own privacy terms: Vercel (hosting and privacy-friendly, cookie-free page-visit counts), Google Analytics (only if you accept analytics cookies — see below), Neon (database), Stripe (payments — we never see card details), Resend (email), Google (optional sign-in), and Anthropic (AI used by the homework helper and worksheet scanner — the text or image you submit is sent to Anthropic to produce a response, so please don't include personal information).",
    ],
  },
  {
    h: "Cookies and analytics",
    p: [
      "We only use Google Analytics if you click \"Accept\" on our cookie notice. It then sets cookies to measure which pages and worksheets are used, so we can improve them. We switch off Google's advertising features and Google Signals, we never use Google Analytics on children's screens (live-quiz player, family challenges, shared student pages), and you can change your choice any time with \"Cookie settings\" at the bottom of every page. If you decline, no Google Analytics code is loaded.",
      "We also use Vercel's cookie-free visit counts, and a few strictly necessary items: a sign-in cookie for account holders, and your browser's local storage to remember your light/dark theme and cookie choice.",
    ],
  },
  {
    h: "Children's privacy",
    p: [
      "Practice Sheet accounts are intended for adults — teachers, tutors and parents — who use the service with students. Students can use worksheets without an account and can join live quizzes with only a nickname. We do not knowingly collect personal information directly from children under 13. If you are a parent or guardian and believe your child has given us personal information, contact us and we will delete it.",
    ],
  },
  {
    h: "Keeping and deleting data",
    p: [
      "We keep account data while your account is active. You can delete family profiles and custom worksheets yourself at any time, and you can ask us to export or delete any of your account data — including scanned worksheets — by emailing us. Live-quiz and whiteboard sessions exist only to run the activity.",
    ],
  },
  {
    h: "Your rights",
    p: ["You can request access to, correction of, or deletion of your personal data at any time by contacting us."],
  },
  {
    h: "Changes",
    p: ["If we change this policy we'll update the date at the top of this page."],
  },
];

export default function Privacy() {
  return (
    <main>
      <Navbar />
      <section className="max-w-2xl mx-auto px-4 sm:px-6 py-16">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Privacy Policy</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Last updated: October 28, 2026</p>
        <p className="text-sm text-slate-600 dark:text-slate-300 mt-4">
          A short, plain-English summary is on our <Link href="/safety" className="underline underline-offset-2">Safety & privacy</Link> page.
        </p>
        <div className="mt-6 text-slate-700 dark:text-slate-300 space-y-6 leading-relaxed text-sm">
          {SECTIONS.map((s) => (
            <div key={s.h}>
              <h2 className="font-semibold text-slate-900 dark:text-white text-base">{s.h}</h2>
              {s.p.map((para, i) => <p key={i} className="mt-2">{para}</p>)}
            </div>
          ))}
          <div>
            <h2 className="font-semibold text-slate-900 dark:text-white text-base">Contact</h2>
            <p className="mt-2">Email <a href={`mailto:${BRAND.contactEmail}`} className="underline underline-offset-2">{BRAND.contactEmail}</a> or use our <Link href="/contact" className="underline underline-offset-2">contact form</Link>.</p>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
