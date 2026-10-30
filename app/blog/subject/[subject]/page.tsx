import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import JsonLd, { breadcrumbLd } from "@/components/seo/JsonLd";
import { coverOf } from "@/lib/blogPresentation";
import { SUBJECT_HUBS, hubBySlug, postsInHub } from "@/lib/blogNav";
import { absoluteUrl } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return SUBJECT_HUBS.map((h) => ({ subject: h.slug }));
}

export function generateMetadata({ params }: { params: { subject: string } }): Metadata {
  const hub = hubBySlug(params.subject);
  if (!hub) return {};
  const title = hub.slug === "learning" ? "Teaching & Study Guides for Teachers, Parents & Students" : `${hub.name} Guides for Teachers, Parents & Students`;
  return {
    title,
    description: `${hub.blurb} Each guide links to free printable worksheets with answer keys.`,
    alternates: { canonical: `/blog/subject/${hub.slug}` },
  };
}

export default function SubjectHubPage({ params }: { params: { subject: string } }) {
  const hub = hubBySlug(params.subject);
  if (!hub) notFound();
  const posts = postsInHub(hub);
  const worksheetSubject = ["math", "english", "science"].includes(hub.slug) ? hub.slug : null;

  return (
    <main>
      <Navbar />
      <JsonLd
        data={[
          breadcrumbLd([
            { name: "Blog", url: absoluteUrl("/blog") },
            { name: hub.title, url: absoluteUrl(`/blog/subject/${hub.slug}`) },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: hub.title,
            itemListElement: posts.map((p, i) => ({ "@type": "ListItem", position: i + 1, name: p.title, url: absoluteUrl(`/blog/${p.slug}`) })),
          },
        ]}
      />
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <nav aria-label="Breadcrumb" className="text-sm text-slate-500 dark:text-slate-400">
          <Link href="/blog" className="hover:underline">Blog</Link> / {hub.title}
        </nav>
        <h1 className="text-3xl sm:text-4xl font-bold mt-2 text-slate-900 dark:text-white">{hub.title}</h1>
        <p className="text-slate-600 dark:text-slate-300 mt-3 max-w-2xl">{hub.blurb}</p>

        <nav aria-label="Blog subjects" className="mt-6 flex flex-wrap gap-2">
          {SUBJECT_HUBS.map((h) => (
            <Link
              key={h.slug}
              href={`/blog/subject/${h.slug}`}
              aria-current={h.slug === hub.slug ? "page" : undefined}
              className={`px-4 py-2 rounded-full text-sm font-medium border ${h.slug === hub.slug ? "bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900 dark:border-white" : "border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-900 dark:hover:border-white"}`}
            >
              {h.title}
            </Link>
          ))}
          <Link href="/blog" className="px-4 py-2 rounded-full text-sm font-medium border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-900 dark:hover:border-white">All guides</Link>
        </nav>

        <p className="mt-6 text-sm text-slate-500 dark:text-slate-400">{posts.length} {posts.length === 1 ? "guide" : "guides"}</p>
        <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="block rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden hover:border-slate-900 dark:hover:border-white">
              <Image src={coverOf(post).src} alt={coverOf(post).alt} width={720} height={405} className="w-full aspect-video object-cover" />
              <div className="p-6">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {(post.audience || []).map((a) => a[0].toUpperCase() + a.slice(1)).join(" · ")}
                  {post.readMinutes ? ` · ${post.readMinutes} min read` : ""}
                </p>
                <h2 className="text-lg font-semibold mt-2 text-slate-900 dark:text-white">{post.title}</h2>
                <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">{post.excerpt}</p>
                <span className="mt-4 block text-sm font-semibold text-indigo-700 dark:text-indigo-300">Read the guide →</span>
              </div>
            </Link>
          ))}
        </div>

        {worksheetSubject && (
          <div className="mt-14 rounded-2xl bg-slate-100 dark:bg-slate-900 p-6 sm:p-8">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Free {hub.name} worksheets by grade</h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">Every grade is organised into units and lessons, with an answer key on every worksheet.</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {Array.from({ length: 12 }, (_, i) => i + 1).map((g) => (
                <Link key={g} href={`/worksheets/${worksheetSubject}/${g}`} className="px-3 py-1.5 rounded-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm text-slate-700 dark:text-slate-200 hover:border-slate-900 dark:hover:border-white">
                  Grade {g}
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>
      <Footer />
    </main>
  );
}
