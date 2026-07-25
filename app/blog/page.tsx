import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { BLOG_POSTS } from "@/lib/blog";

export const metadata = { title: "Blog | Practice Sheet" };

export default function BlogIndex() {
  const posts = [...BLOG_POSTS].sort((a, b) => (a.date < b.date ? 1 : -1));
  return (
    <main>
      <Navbar />
      <section className="max-w-2xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold">Blog</h1>
        <p className="text-slate-600 mt-2">Tips for teachers and parents, and notes on how we build this.</p>
        <div className="mt-8 space-y-8">
          {posts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="block group">
              <p className="text-xs text-slate-400">{new Date(post.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
              <h2 className="text-xl font-semibold mt-1 group-hover:underline">{post.title}</h2>
              <p className="text-slate-600 mt-1">{post.excerpt}</p>
            </Link>
          ))}
        </div>
      </section>
      <Footer />
    </main>
  );
}
