import Link from "next/link";
import Image from "next/image";
import { coverOf, subjectOf } from "@/lib/blogPresentation";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { BLOG_POSTS, type Audience } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Guides for Teachers, Parents & Students",
  description: "Practical guides on teaching, helping at home and studying — with worked examples and free printable worksheets for Math, English and Science, grades 1–12.",
  alternates: { canonical: "/blog" },
};

const FILTERS: { id: Audience | "all"; label: string }[] = [
  { id: "all", label: "All guides" },
  { id: "teachers", label: "For teachers" },
  { id: "parents", label: "For parents" },
  { id: "students", label: "For students" },
];

export default function BlogIndex({ searchParams }: { searchParams: { for?: string; q?: string; subject?: string } }) {
  const active = (FILTERS.find((f) => f.id === searchParams?.for)?.id || "all") as Audience | "all";
  const query = (searchParams.q || "").trim().slice(0, 150);
  const subject = ["Math", "English", "Science", "Learning"].includes(searchParams.subject || "") ? searchParams.subject! : "";
  const filterHref = (audience: string) => { const params = new URLSearchParams(); if (audience !== "all") params.set("for", audience); if (query) params.set("q", query); if (subject) params.set("subject", subject); return `/blog${params.size ? `?${params}` : ""}`; };
  const posts = [...BLOG_POSTS]
    .filter((p) => active === "all" || p.audience?.includes(active))
    .filter((p) => (!subject || subjectOf(p) === subject) && (!query || `${p.title} ${p.excerpt} ${p.content.join(" ")}`.toLowerCase().includes(query.toLowerCase())))
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : a.title.localeCompare(b.title)));

  return (
    <main>
      <Navbar />
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">A little guidance. A lot more confidence.</h1>
        <p className="text-slate-600 dark:text-slate-300 mt-2 max-w-2xl">
          Practical guides for teaching, helping at home and studying — each with worked examples and free printable worksheets.
        </p>
        <form action="/blog" className="mt-8 grid gap-3 sm:grid-cols-[1fr_180px_auto]">
          {active !== "all" && <input type="hidden" name="for" value={active} />}
          <label className="text-sm font-medium">Search guides<input name="q" defaultValue={query} maxLength={150} placeholder="Try fractions, reading, homework…" className="mt-2 w-full rounded-xl border border-slate-300 bg-white p-3 text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white" /></label>
          <label className="text-sm font-medium">Subject<select name="subject" defaultValue={subject} className="mt-2 w-full rounded-xl border border-slate-300 bg-white p-3 text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white"><option value="">All subjects</option>{["Math", "English", "Science", "Learning"].map(s => <option key={s}>{s}</option>)}</select></label>
          <button className="self-end rounded-xl bg-indigo-700 px-6 py-3 font-semibold text-white hover:bg-indigo-800">Find guides</button>
        </form>
        <nav className="mt-6 flex flex-wrap gap-2" aria-label="Filter guides by audience">
          {FILTERS.map((f) => (
            <Link
              key={f.id}
              href={filterHref(f.id)}
              aria-current={active === f.id ? "page" : undefined}
              className={`px-4 py-2 rounded-full text-sm font-medium border ${
                active === f.id
                  ? "bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900 dark:border-white"
                  : "border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-900 dark:hover:border-white"
              }`}
            >
              {f.label}
            </Link>
          ))}
        </nav>
        <p className="mt-6 text-sm text-slate-500 dark:text-slate-400" role="status">{posts.length} {posts.length === 1 ? "guide" : "guides"} to explore</p>
        {posts.length === 0 && <div className="mt-8 rounded-xl border p-8"><h2 className="font-bold text-xl">No guides found</h2><p className="mt-2">Try a shorter search or another subject.</p><Link href="/blog" className="mt-4 inline-block underline">Clear all filters</Link></div>}
        <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="block rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden hover:border-slate-900 dark:hover:border-white">
              <Image src={coverOf(post).src} alt={coverOf(post).alt} width={720} height={405} className="w-full aspect-video object-cover" />
              <div className="p-6"><p className="mb-3 text-xs font-bold uppercase tracking-widest text-indigo-700 dark:text-indigo-300">{subjectOf(post)}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {(post.audience || []).map((a) => a[0].toUpperCase() + a.slice(1)).join(" · ")}
                {post.readMinutes ? ` · ${post.readMinutes} min read` : ""}
              </p>
              <h2 className="text-lg font-semibold mt-2 text-slate-900 dark:text-white">{post.title}</h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">{post.excerpt}</p><span className="mt-5 block text-sm font-semibold text-indigo-700 dark:text-indigo-300">Read the guide →</span></div>
            </Link>
          ))}
        </div>
      </section>
      <Footer />
    </main>
  );
}
