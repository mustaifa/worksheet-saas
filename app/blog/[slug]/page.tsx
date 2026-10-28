import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BlogBody from "@/components/BlogBody";
import SignupCta from "@/components/SignupCta";
import JsonLd, { breadcrumbLd } from "@/components/seo/JsonLd";
import { BLOG_POSTS, getPostBySlug } from "@/lib/blog";
import { OG_IMAGE, absoluteUrl, SITE_NAME } from "@/lib/site";
import { isFreeMode } from "@/lib/access";

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
  const more = BLOG_POSTS.filter((p) => p.slug !== post.slug).sort((a, b) => (a.date < b.date ? 1 : -1)).slice(0, 3);

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
            datePublished: post.date,
            dateModified: post.updated || post.date,
            mainEntityOfPage: absoluteUrl(`/blog/${post.slug}`),
            author: { "@type": "Organization", name: SITE_NAME, url: absoluteUrl("/") },
            publisher: { "@type": "Organization", name: SITE_NAME, logo: { "@type": "ImageObject", url: absoluteUrl("/logo-mark.png") } },
          },
          breadcrumbLd([
            { name: "Blog", url: absoluteUrl("/blog") },
            { name: post.title, url: absoluteUrl(`/blog/${post.slug}`) },
          ]),
        ]}
      />
      <article className="max-w-2xl mx-auto px-6 py-16">
        <p className="text-sm text-slate-500 dark:text-slate-400"><Link href="/blog" className="hover:underline">Blog</Link></p>
        <h1 className="text-3xl sm:text-4xl font-bold mt-2 text-slate-900 dark:text-white">{post.title}</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-3">
          {new Date(post.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          {post.readMinutes ? ` · ${post.readMinutes} min read` : ""}
        </p>
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

        {more.length > 0 && (
          <div className="mt-12">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">More from the blog</h2>
            <ul className="mt-3 space-y-2">
              {more.map((p) => (
                <li key={p.slug}><Link href={`/blog/${p.slug}`} className="text-slate-700 dark:text-slate-300 hover:underline">{p.title}</Link></li>
              ))}
            </ul>
          </div>
        )}
      </article>
      <Footer />
    </main>
  );
}
