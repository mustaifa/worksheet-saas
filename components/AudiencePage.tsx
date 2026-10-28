import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SignupCta from "@/components/SignupCta";
import TrustStrip from "@/components/TrustStrip";
import JsonLd, { faqLd } from "@/components/seo/JsonLd";
import { BLOG_POSTS, type Audience } from "@/lib/blog";
import { isFreeMode } from "@/lib/access";

export type AudienceConfig = {
  audience: Audience;
  eyebrow: string;
  title: string;
  intro: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  uses: { title: string; body: string; href?: string; linkLabel?: string }[];
  routine?: { title: string; steps: string[] };
  quickLinks: { label: string; href: string }[];
  faqs: { q: string; a: string }[];
};

export default function AudiencePage({ c }: { c: AudienceConfig }) {
  const freeMode = isFreeMode();
  const guides = BLOG_POSTS.filter((p) => p.audience?.includes(c.audience)).sort((a, b) => (a.date < b.date ? 1 : -1)).slice(0, 6);

  return (
    <main>
      <Navbar />
      <JsonLd data={faqLd(c.faqs)} />

      <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-16 pb-10">
        <p className="text-sm font-semibold uppercase tracking-wide text-amber-600 dark:text-amber-400">{c.eyebrow}</p>
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-900 dark:text-white mt-2 max-w-3xl">{c.title}</h1>
        <p className="mt-5 text-lg text-slate-600 dark:text-slate-300 max-w-2xl">{c.intro}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href={c.primaryCta.href} className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-3 rounded-lg font-medium hover:bg-slate-700 dark:hover:bg-slate-200">{c.primaryCta.label}</Link>
          <Link href={c.secondaryCta.href} className="px-6 py-3 rounded-lg font-medium border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-900">{c.secondaryCta.label}</Link>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-4">
        <TrustStrip />
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">How it helps</h2>
        <div className="mt-6 grid sm:grid-cols-2 gap-4">
          {c.uses.map((u) => (
            <div key={u.title} className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
              <h3 className="font-semibold text-slate-900 dark:text-white">{u.title}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">{u.body}</p>
              {u.href && <Link href={u.href} className="inline-block mt-3 text-sm font-medium text-slate-900 dark:text-white underline underline-offset-2">{u.linkLabel || "Try it"} →</Link>}
            </div>
          ))}
        </div>
      </section>

      {c.routine && (
        <section className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
          <div className="rounded-2xl bg-slate-100 dark:bg-slate-900 p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{c.routine.title}</h2>
            <ol className="mt-5 space-y-3">
              {c.routine.steps.map((s, i) => (
                <li key={i} className="flex gap-4">
                  <span className="shrink-0 w-8 h-8 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center text-sm font-bold">{i + 1}</span>
                  <span className="text-slate-700 dark:text-slate-200 pt-1">{s}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Popular starting points</h2>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {c.quickLinks.map((l) => (
            <Link key={l.href} href={l.href} className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 text-sm font-medium text-slate-800 dark:text-slate-100 hover:border-slate-900 dark:hover:border-white">
              {l.label}
              <span className="block text-xs font-normal text-slate-500 dark:text-slate-400 mt-0.5">free · with answer key</span>
            </Link>
          ))}
        </div>
      </section>

      {guides.length > 0 && (
        <section className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Guides for you</h2>
            <Link href={`/blog?for=${c.audience}`} className="text-sm font-medium text-slate-700 dark:text-slate-300 hover:underline shrink-0">All guides →</Link>
          </div>
          <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {guides.map((p) => (
              <Link key={p.slug} href={`/blog/${p.slug}`} className="block rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 hover:border-slate-900 dark:hover:border-white">
                <p className="font-semibold text-slate-900 dark:text-white">{p.title}</p>
                <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 line-clamp-3">{p.excerpt}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Questions</h2>
        <div className="mt-6 space-y-6">
          {c.faqs.map((f) => (
            <div key={f.q}>
              <h3 className="font-semibold text-slate-900 dark:text-white">{f.q}</h3>
              <p className="text-slate-600 dark:text-slate-300 mt-1">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-10 text-center">
        <div className="rounded-2xl bg-slate-100 dark:bg-slate-900 p-8 sm:p-10">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Ready when you are</h2>
          <p className="text-slate-600 dark:text-slate-300 mt-2">{freeMode ? "Free during our launch — no card needed." : "Start with a free trial — no card needed."}</p>
          <SignupCta label={freeMode ? "Create a free account" : "Start your free trial"} className="mt-6" />
        </div>
      </section>
      <Footer />
    </main>
  );
}
