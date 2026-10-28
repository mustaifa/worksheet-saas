import Link from "next/link";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ShieldCheckIcon, NoAdsIcon, UsersOffIcon, LockIcon, KeyCheckIcon, MailIcon } from "@/components/Icons";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Safety & Privacy for Schools and Families",
  description: "How Practice Sheet keeps students safe: no ads, no student accounts needed, parent-controlled family profiles, and no selling of data.",
  alternates: { canonical: "/safety" },
};

const PROMISES = [
  { Icon: NoAdsIcon, t: "No ads, ever", d: "There is no advertising anywhere on Practice Sheet — not on worksheets, quizzes or guides." },
  { Icon: UsersOffIcon, t: "No student accounts needed", d: "Worksheets can be viewed, printed and downloaded without signing in. Students join live quizzes and whiteboards with a code and a first name or nickname only." },
  { Icon: LockIcon, t: "Parents stay in control", d: "Family profiles are created by a parent inside the parent's own account, can be protected with a 4-digit PIN, and can be deleted at any time." },
  { Icon: ShieldCheckIcon, t: "We don't sell data", d: "We never sell or rent personal information, and we don't build advertising profiles." },
  { Icon: KeyCheckIcon, t: "Accurate, age-appropriate content", d: "Questions are written for each grade and checked by automated tests. The homework helper is instructed to stay on schoolwork, keep answers age-appropriate, and never ask for personal details." },
];

const DATA = [
  { what: "Teacher or parent account", detail: "Name, email address and a securely hashed password (or your Google sign-in). Used to run your account." },
  { what: "Family profiles", detail: "A child's first name or nickname, an avatar, a default grade, an optional PIN, and challenge scores and rewards — all inside the parent's account." },
  { what: "Live quizzes and whiteboards", detail: "The nickname a student types and their answers or drawings during the session." },
  { what: "Custom and scanned worksheets", detail: "The worksheets you create or the photos you upload to convert, saved to your account so you can reopen them." },
  { what: "Homework helper and scanner", detail: "The question or worksheet photo you submit is sent to our AI provider (Anthropic) to produce a response. Please don't include personal information." },
  { what: "Topic requests and contact messages", detail: "What you write, and an email address only if you choose to give one." },
  { what: "Payments", detail: "Handled entirely by Stripe. We never see or store card details." },
];

export default function Safety() {
  return (
    <main>
      <Navbar />
      <section className="max-w-4xl mx-auto px-4 sm:px-6 pt-16 pb-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">Safety & privacy</p>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mt-2">Safe for classrooms. Safe at home.</h1>
        <p className="mt-4 text-lg text-slate-600 dark:text-slate-300 max-w-2xl">
          Practice Sheet is built for teachers and parents to use with students. Here's exactly what we do — and don't do — with information.
        </p>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid sm:grid-cols-2 gap-4">
          {PROMISES.map(({ Icon, t, d }) => (
            <div key={t} className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 flex gap-4">
              <span className="shrink-0 w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center"><Icon size={20} /></span>
              <span>
                <span className="block font-semibold text-slate-900 dark:text-white">{t}</span>
                <span className="block text-sm text-slate-600 dark:text-slate-300 mt-1">{d}</span>
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">What we store, and why</h2>
        <div className="mt-5 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-sm">
            <tbody>
              {DATA.map((r, i) => (
                <tr key={r.what} className={i % 2 ? "bg-slate-50 dark:bg-slate-900/50" : "bg-white dark:bg-slate-900"}>
                  <th scope="row" className="text-left align-top font-semibold text-slate-900 dark:text-white p-4 w-1/3">{r.what}</th>
                  <td className="p-4 text-slate-600 dark:text-slate-300">{r.detail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
          We count page visits with cookie-free analytics, and use Google Analytics only if you accept it on our cookie notice — never on children's quiz or challenge screens. Full details are in our <Link href="/privacy" className="underline underline-offset-2">Privacy Policy</Link>.
        </p>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">For schools</h2>
        <ul className="mt-4 space-y-2 list-disc pl-5 text-slate-700 dark:text-slate-300">
          <li>Teachers can use every worksheet without asking students to create accounts.</li>
          <li>Live quizzes need only a join code and a first name or nickname — tell students not to use full names.</li>
          <li>Accounts are intended for adults (teachers, tutors and parents). We don't knowingly collect personal information from children under 13.</li>
          <li>You can ask us to export or delete your account data at any time.</li>
        </ul>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <div className="rounded-2xl bg-slate-100 dark:bg-slate-900 p-6 sm:p-8 flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
          <div>
            <p className="font-semibold text-slate-900 dark:text-white">Questions or a concern?</p>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">Email us and we'll respond personally. To report anything worrying about a child's safety, write "Safety" in the subject.</p>
          </div>
          <a href={`mailto:${BRAND.contactEmail}?subject=Safety`} className="inline-flex items-center gap-2 shrink-0 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-5 py-2.5 rounded-lg font-medium"><MailIcon size={16} />{BRAND.contactEmail}</a>
        </div>
      </section>
      <Footer />
    </main>
  );
}
