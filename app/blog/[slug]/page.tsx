import Link from "next/link";
import Image from "next/image";
import { coverOf, headingId } from "@/lib/blogPresentation";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BlogBody from "@/components/BlogBody";
import SignupCta from "@/components/SignupCta";
import JsonLd, { breadcrumbLd } from "@/components/seo/JsonLd";
import { BLOG_POSTS, getPostBySlug } from "@/lib/blog";
import { OG_IMAGE, absoluteUrl, SITE_NAME } from "@/lib/site";
import { isFreeMode } from "@/lib/access";
import { hubFor, relatedPosts, neighbours } from "@/lib/blogNav";

export const dynamicParams = false;

export function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug);
  if (!post) return {};
  return {
    title: { absolute: post.seoTitle || `${post.title} | Practice Sheet Blog` },
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: { title: post.title, description: post.excerpt, type: "article", url: `/blog/${post.slug}`, publishedTime: post.date, images: [OG_IMAGE] },
  };
}

export default function BlogPost({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug);
  if (!post) notFound();
  const freeMode = isFreeMode();
  const hub = hubFor(post);
  const { newer, older } = neighbours(post);
  // don't repeat the previous/next guides in "Keep reading"
  const more = relatedPosts(post, 5).filter((p) => p.slug !== newer?.slug && p.slug !== older?.slug).slice(0, 3);
  const fmt = (d: string) => new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });

  return (
    <main>
      <Navbar />
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: post.title,
            description: post.excerpt,
            image: absoluteUrl(coverOf(post).src),
            datePublished: post.date,
            dateModified: post.updated || post.date,
            mainEntityOfPage: absoluteUrl(`/blog/${post.slug}`),
            author: { "@type": "Organization", name: SITE_NAME, url: absoluteUrl("/") },
            publisher: { "@type": "Organization", name: SITE_NAME, logo: { "@type": "ImageObject", url: absoluteUrl("/logo-mark.png") } },
          },
          breadcrumbLd([
            { name: "Blog", url: absoluteUrl("/blog") },
            { name: hub.title, url: absoluteUrl(`/blog/subject/${hub.slug}`) },
            { name: post.title, url: absoluteUrl(`/blog/${post.slug}`) },
          ]),
        ]}
      />
      <article className="max-w-2xl mx-auto px-6 py-16">
        <nav aria-label="Breadcrumb" className="text-sm text-slate-500 dark:text-slate-400">
          <Link href="/blog" className="hover:underline">Blog</Link> /{" "}
          <Link href={`/blog/subject/${hub.slug}`} className="hover:underline">{hub.title}</Link>
        </nav>
        <h1 className="text-3xl sm:text-4xl font-bold mt-2 text-slate-900 dark:text-white">{post.title}</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-3">
          {fmt(post.date)}
          {post.updated && post.updated !== post.date ? ` · Updated ${fmt(post.updated)}` : ""}
          {post.readMinutes ? ` · ${post.readMinutes} min read` : ""}
        </p>
        <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">{post.excerpt}</p>
        <Image src={coverOf(post).src} alt={coverOf(post).alt} width={720} height={405} priority className="mt-8 w-full rounded-2xl" />
        {post.content.some(b => b.startsWith("## ")) && <nav aria-label="In this guide" className="mt-8 rounded-xl bg-slate-100 p-6 dark:bg-slate-900"><h2 className="font-bold">In this guide</h2><ul className="mt-3 space-y-2 text-sm">{post.content.map((b, i) => b.startsWith("## ") ? <li key={i}><a href={`#${headingId(b.slice(3), i)}`} className="underline underline-offset-4">{b.slice(3)}</a></li> : null)}</ul></nav>}
        <BlogBody blocks={post.content} />

        {post.worksheets && post.worksheets.length > 0 && (
          <div className="mt-12 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Free printable worksheets for this topic</h2>
            <div className="mt-4 grid sm:grid-cols-2 gap-2">
              {post.worksheets.map((w) => (
                <Link key={w.href} href={w.href} className="rounded-lg border border-slate-200 dark:border-slate-700 px-4 py-3 text-sm font-medium text-slate-800 dark:text-slate-100 hover:border-slate-900 dark:hover:border-white">
                  {w.label}
                  <span className="block text-xs font-normal text-slate-500 dark:text-slate-400 mt-0.5">with answer key · print or PDF</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="mt-10 rounded-xl bg-slate-100 dark:bg-slate-900 p-6 text-center">
          <p className="font-semibold text-slate-900 dark:text-white">Make a fresh worksheet on any topic in seconds</p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Every answer checked by code. {freeMode ? "Free during our launch — no card needed." : "Start with a free trial."}</p>
          <SignupCta label={freeMode ? "Create a free account" : "Start your free trial"} className="mt-4" />
        </div>

        {(newer || older) && (
          <nav aria-label={`More ${hub.title.toLowerCase()}`} className="mt-12 grid sm:grid-cols-2 gap-3">
            {older ? (
              <Link href={`/blog/${older.slug}`} className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 hover:border-slate-900 dark:hover:border-white">
                <span className="block text-xs text-slate-500 dark:text-slate-400">← Previous in {hub.title}</span>
                <span className="block mt-1 font-semibold text-slate-900 dark:text-white">{older.title}</span>
              </Link>
            ) : <span />}
            {newer && (
              <Link href={`/blog/${newer.slug}`} className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 text-right hover:border-slate-900 dark:hover:border-white">
                <span className="block text-xs text-slate-500 dark:text-slate-400">Next in {hub.title} →</span>
                <span className="block mt-1 font-semibold text-slate-900 dark:text-white">{newer.title}</span>
              </Link>
            )}
          </nav>
        )}

        {more.length > 0 && (
          <div className="mt-12">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Keep reading</h2>
            <div className="mt-4 grid sm:grid-cols-3 gap-4">
              {more.map((p) => (
                <Link key={p.slug} href={`/blog/${p.slug}`} className="block rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:border-slate-900 dark:hover:border-white">
                  <Image src={coverOf(p).src} alt="" width={360} height={203} className="w-full aspect-video object-cover" />
                  <span className="block p-3 text-sm font-semibold text-slate-900 dark:text-white">{p.title}</span>
                </Link>
              ))}
            </div>
            <p className="mt-4 text-sm"><Link href={`/blog/subject/${hub.slug}`} className="font-semibold text-indigo-700 dark:text-indigo-300 hover:underline">See all {hub.title} →</Link></p>
          </div>
        )}
      </article>
      <Footer />
    </main>
  );
}
