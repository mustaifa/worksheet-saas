import Link from "next/link";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TrustStrip from "@/components/TrustStrip";
import JsonLd from "@/components/seo/JsonLd";
import { BRAND } from "@/lib/brand";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "About Practice Sheet — Who We Are",
  description: "Practice Sheet is built by Ghulam Malik at Aethel Systems: free printable worksheets for grades 1–12 with answer keys checked by code, no ads, and no student accounts needed.",
  alternates: { canonical: "/about" },
};

const PRINCIPLES = [
  { t: "Every answer must be right", d: "Math questions and their answers are produced together by code. English and Science questions come from reviewed question banks. Nothing is guessed by an AI model, and every topic, grade and difficulty is checked by automated tests." },
  { t: "Free worksheets, always", d: "Every worksheet page on the site is free to view, print and download with its answer key. That won't change." },
  { t: "No ads, ever", d: "Students should be able to practise without pop-ups or distractions. We don't run ads and don't sell data." },
  { t: "Children's privacy first", d: "Students don't need accounts to use worksheets or join a live quiz. Family profiles are created and controlled by parents." },
  { t: "Built with teachers and parents", d: "New topics come from what people ask for. Every topic request is read." },
];

export default function About() {
  return (
    <main>
      <Navbar />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: BRAND.company,
          url: SITE_URL,
          email: BRAND.contactEmail,
          founder: { "@type": "Person", name: BRAND.founder.name, sameAs: [BRAND.founder.linkedin] },
          brand: { "@type": "Brand", name: BRAND.name },
        }}
      />
      <section className="max-w-3xl mx-auto px-4 sm:px-6 pt-16 pb-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-amber-600 dark:text-amber-400">About us</p>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mt-2">Worksheets you can trust — because the answers are always right</h1>
        <div className="mt-6 space-y-4 text-slate-700 dark:text-slate-300 leading-relaxed">
          <p>
            Practice Sheet started with a frustration many teachers and parents share: finding good practice worksheets
            takes too long, and a lot of what's free online has typos, answer keys that don't match the questions, or
            content pitched at the wrong grade.
          </p>
          <p>
            So instead of collecting worksheets, we built a generator. Every worksheet is created from tested rules —
            math is computed, English and Science come from reviewed question banks — so the answer key matches the
            questions every time, for every grade from 1 to 12.
          </p>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 flex flex-col sm:flex-row gap-6">
          <div className="shrink-0 w-16 h-16 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center text-xl font-bold" aria-hidden="true">GM</div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Who's behind Practice Sheet</h2>
            <p className="mt-3 text-slate-700 dark:text-slate-300 leading-relaxed">
              Practice Sheet is built by <strong>{BRAND.founder.name}</strong>, a software engineer with around 20 years of
              experience building and supporting systems for banking and lending — software where a wrong number simply
              isn't acceptable. That's the standard Practice Sheet holds its answer keys to.
            </p>
            <p className="mt-3 text-slate-700 dark:text-slate-300 leading-relaxed">
              Practice Sheet is a product of {BRAND.company} and launched in {BRAND.launched}. It's used by teachers,
              tutors, parents and students in more than 90 countries.
            </p>
            <div className="mt-4 flex flex-wrap gap-3 text-sm">
              <a href={BRAND.founder.linkedin} target="_blank" rel="noopener noreferrer" className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800">{BRAND.founder.name} on LinkedIn</a>
              <a href={`mailto:${BRAND.contactEmail}`} className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800">{BRAND.contactEmail}</a>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">What we stand for</h2>
        <div className="mt-6 space-y-5">
          {PRINCIPLES.map((p) => (
            <div key={p.t}>
              <h3 className="font-semibold text-slate-900 dark:text-white">{p.t}</h3>
              <p className="text-slate-600 dark:text-slate-300 mt-1">{p.d}</p>
            </div>
          ))}
        </div>
        <p className="mt-6 text-slate-600 dark:text-slate-300">
          Read more about <Link href="/blog/how-we-keep-every-answer-key-accurate" className="underline underline-offset-2">how we keep every answer key accurate</Link> and
          our <Link href="/safety" className="underline underline-offset-2">safety & privacy commitments</Link>.
        </p>
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <TrustStrip />
      </section>
      <Footer />
    </main>
  );
}
