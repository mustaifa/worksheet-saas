import Link from "next/link";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import JsonLd, { faqLd } from "@/components/seo/JsonLd";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = {
  title: "How Practice Sheet Uses AI (and Where It Doesn't)",
  description: "Worksheets and answer keys are made by code, not AI. Our homework helper gives hints instead of answers. Here's exactly where AI is used, what data it sees, and the safeguards for children.",
  alternates: { canonical: "/ai" },
};

const NO_AI = [
  { t: "Worksheets and answer keys", d: "Math questions and their answers are calculated together by code. English and Science questions come from question banks we write and check by hand. No AI model writes or guesses any question or answer." },
  { t: "The curriculum", d: "Units, lessons and skills follow the Common Core and NGSS standards and are organised by people, not generated." },
  { t: "Marking in Live Quiz and Family Challenge", d: "Typed answers are checked against the answer key by fixed rules. Topics whose answers can't be marked fairly that way are left out of those modes." },
  { t: "Guides on the blog", d: "Every worked example is recalculated and every fact checked against sources before it's published." },
];

const WITH_AI = [
  {
    t: "Homework helper",
    d: "When a child is stuck, the helper gives one hint or one step at a time and asks them to try the next step. It checks the child's own answers and points to where a mistake happened. It won't hand over the answer to a homework question just because it's asked, and it won't write essays or assignments. If a child is still stuck after a few hints, it shows a worked example of a similar problem — then asks them to try theirs.",
  },
  {
    t: "Worksheet scanner",
    d: "Teachers and parents can photograph a worksheet they wrote themselves and turn it into a clean, editable PDF. AI reads the photo and copies the text exactly; it doesn't create new questions.",
  },
];

const SAFEGUARDS = [
  "The helper only talks about schoolwork and gently steers back to it if a conversation drifts.",
  "It never pretends to be human, a friend or a companion, and never asks a child to keep a conversation secret.",
  "If a child mentions something worrying, it encourages them to talk to a parent, teacher or another trusted adult.",
  "It doesn't ask for names, schools, addresses or other personal details, and everything it says is kept age-appropriate.",
  "Use is limited each day, and accounts belong to adults — parents, tutors and teachers — not children.",
];

const FAQS = [
  { q: "Does Practice Sheet use AI to write worksheets?", a: "No. Every worksheet and answer key is produced by code or from question banks we write and check ourselves. AI is only used in the homework helper and the worksheet scanner." },
  { q: "Will the homework helper do my child's homework?", a: "No. It's designed to give hints one step at a time and to check your child's own work. It won't give the answer to a homework question on request, and it won't write essays or assignments." },
  { q: "Are homework helper conversations saved?", a: "We don't save the conversation itself — only a count of messages used each day, to apply the daily limit. The message is sent to our AI provider, Anthropic, to produce a reply." },
  { q: "Is my child's data used to train AI?", a: "No. Anthropic's commercial terms don't allow it to train models on content sent through its API, which is how Practice Sheet connects to it." },
  { q: "Can the AI make mistakes?", a: "Yes. Any AI can sometimes be wrong, so we ask students to check important answers with a teacher. That's also why worksheets and answer keys don't use AI at all." },
];

export default function AiPage() {
  return (
    <main>
      <Navbar />
      <JsonLd data={faqLd(FAQS)} />
      <section className="max-w-3xl mx-auto px-4 sm:px-6 pt-16 pb-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-amber-600 dark:text-amber-400">AI & your child</p>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mt-2">Practice that makes kids think — not AI that thinks for them</h1>
        <div className="mt-6 space-y-4 text-slate-700 dark:text-slate-300 leading-relaxed">
          <p>
            Many parents and teachers are worried about AI in children's education: homework done by a chatbot, answers that
            sound confident but are wrong, and children's data going places it shouldn't. We share those worries. This page
            explains exactly where Practice Sheet uses AI, where it deliberately doesn't, and the safeguards we've put in place.
          </p>
        </div>
        <div className="mt-8 grid sm:grid-cols-3 gap-3 text-sm">
          <div className="rounded-xl border border-emerald-200 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-950/40 p-4"><p className="font-semibold text-emerald-900 dark:text-emerald-200">No AI</p><p className="mt-1 text-emerald-900/80 dark:text-emerald-100/80">in any worksheet or answer key</p></div>
          <div className="rounded-xl border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/40 p-4"><p className="font-semibold text-amber-900 dark:text-amber-200">Hints, not answers</p><p className="mt-1 text-amber-900/80 dark:text-amber-100/80">from the homework helper</p></div>
          <div className="rounded-xl border border-sky-200 dark:border-sky-900 bg-sky-50 dark:bg-sky-950/40 p-4"><p className="font-semibold text-sky-900 dark:text-sky-200">Not used for training</p><p className="mt-1 text-sky-900/80 dark:text-sky-100/80">conversations aren't saved by us</p></div>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Where we don't use AI</h2>
        <div className="mt-5 space-y-5">
          {NO_AI.map((x) => (
            <div key={x.t}>
              <h3 className="font-semibold text-slate-900 dark:text-white">{x.t}</h3>
              <p className="text-slate-600 dark:text-slate-300 mt-1">{x.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Where we do — and how</h2>
        <div className="mt-5 space-y-5">
          {WITH_AI.map((x) => (
            <div key={x.t}>
              <h3 className="font-semibold text-slate-900 dark:text-white">{x.t}</h3>
              <p className="text-slate-600 dark:text-slate-300 mt-1">{x.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Safeguards in the homework helper</h2>
        <ul className="mt-4 list-disc pl-6 space-y-2 text-slate-700 dark:text-slate-300">
          {SAFEGUARDS.map((s) => <li key={s}>{s}</li>)}
        </ul>
      </section>

      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">What data the AI sees</h2>
        <div className="mt-4 space-y-4 text-slate-700 dark:text-slate-300 leading-relaxed">
          <p>
            Only the question or photo that's submitted is sent to our AI provider, <strong>Anthropic</strong>, to produce a reply.
            We don't store homework-helper conversations — just a daily count of messages, so we can apply a fair-use limit.
            Anthropic's commercial terms don't allow it to train its models on content sent through its API.
          </p>
          <p>Please don't include names, school names or other personal information in questions or photos.</p>
          <p>
            AI can sometimes be wrong. Students should check important answers with a teacher — and that's exactly why our
            worksheets and answer keys don't rely on it. More detail is in our <Link href="/privacy" className="underline underline-offset-2">privacy policy</Link> and{" "}
            <Link href="/safety" className="underline underline-offset-2">safety & privacy commitments</Link>.
          </p>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <div className="rounded-2xl bg-slate-100 dark:bg-slate-900 p-6 sm:p-8">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">For parents: AI and homework at home</h2>
          <p className="mt-2 text-slate-600 dark:text-slate-300">How to talk to your child about AI, house rules that work, signs homework was done by a chatbot, and good ways to use AI for learning.</p>
          <Link href="/blog/ai-and-homework-parents-guide" className="inline-block mt-4 font-semibold text-indigo-700 dark:text-indigo-300 hover:underline">Read the parent's guide →</Link>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Questions</h2>
        <div className="mt-4 space-y-5">
          {FAQS.map((f) => (
            <div key={f.q}>
              <h3 className="font-semibold text-slate-900 dark:text-white">{f.q}</h3>
              <p className="text-slate-600 dark:text-slate-300 mt-1">{f.a}</p>
            </div>
          ))}
        </div>
        <p className="mt-8 text-sm text-slate-500 dark:text-slate-400">
          Questions or concerns? Email <a href={`mailto:${BRAND.contactEmail}`} className="underline">{BRAND.contactEmail}</a> — {BRAND.founder.name}, founder, reads every message. Last updated October 2026.
        </p>
      </section>
      <Footer />
    </main>
  );
}
