import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { BLOG_POSTS, getPostBySlug } from "@/lib/blog";

export function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug);
  if (!post) return {};
  return { title: `${post.title} | Practice Sheet Blog`, description: post.excerpt };
}

export default function BlogPost({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug);
  if (!post) notFound();

  return (
    <main>
      <Navbar />
      <article className="max-w-2xl mx-auto px-6 py-16">
        <p className="text-sm text-slate-500"><Link href="/blog" className="hover:underline">Blog</Link></p>
        <h1 className="text-3xl font-bold mt-2">{post.title}</h1>
        <p className="text-xs text-slate-400 mt-2">
          {new Date(post.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
        </p>
        <div className="prose prose-slate mt-8 space-y-4 text-slate-700 leading-relaxed">
          {post.content.map((para, i) => <p key={i}>{para}</p>)}
        </div>
        <div className="mt-10 rounded-xl bg-slate-50 p-6 text-center">
          <Link href="/signup" className="inline-block bg-slate-900 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-slate-700">
            Try Practice Sheet free
          </Link>
        </div>
      </article>
      <Footer />
    </main>
  );
}
