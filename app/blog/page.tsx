import Link from "next/link";
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

export default function BlogIndex({ searchParams }: { searchParams: { for?: string } }) {
  const active = (FILTERS.find((f) => f.id === searchParams?.for)?.id || "all") as Audience | "all";
  const posts = [...BLOG_POSTS]
    .filter((p) => active === "all" || p.audience?.includes(active))
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : a.title.localeCompare(b.title)));

  return (
    <main>
      <Navbar />
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">Guides</h1>
        <p className="text-slate-600 dark:text-slate-300 mt-2 max-w-2xl">
          Practical guides for teaching, helping at home and studying — each with worked examples and free printable worksheets.
        </p>
        <div className="mt-6 flex flex-wrap gap-2" role="tablist" aria-label="Filter guides">
          {FILTERS.map((f) => (
            <Link
              key={f.id}
              href={f.id === "all" ? "/blog" : `/blog?for=${f.id}`}
              role="tab"
              aria-selected={active === f.id}
              className={`px-4 py-2 rounded-full text-sm font-medium border ${
                active === f.id
                  ? "bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900 dark:border-white"
                  : "border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-900 dark:hover:border-white"
              }`}
            >
              {f.label}
            </Link>
          ))}
        </div>
        <div className="mt-8 grid sm:grid-cols-2 gap-4">
          {posts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="block rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 hover:border-slate-900 dark:hover:border-white">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {(post.audience || []).map((a) => a[0].toUpperCase() + a.slice(1)).join(" · ")}
                {post.readMinutes ? ` · ${post.readMinutes} min read` : ""}
              </p>
              <h2 className="text-lg font-semibold mt-2 text-slate-900 dark:text-white">{post.title}</h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">{post.excerpt}</p>
            </Link>
          ))}
        </div>
      </section>
      <Footer />
    </main>
  );
}
