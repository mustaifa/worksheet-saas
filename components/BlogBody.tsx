import Link from "next/link";
import React from "react";
import { headingId } from "@/lib/blogPresentation";

// Renders blog content written as an array of lightweight-markdown blocks:
//   "## Heading", "### Subheading", "- list item" (consecutive items group),
//   "> tip", and inline [text](/path) links, **bold** and *italic*.
function inline(text: string, key: string): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  const re = /\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*|\*([^*\s][^*]*?)\*/g;
  let last = 0, m: RegExpExecArray | null, i = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    if (m[1]) {
      const href = m[2];
      out.push(href.startsWith("/")
        ? <Link key={`${key}-${i++}`} href={href} className="text-slate-900 dark:text-white underline underline-offset-2 decoration-slate-400 hover:decoration-slate-900 dark:hover:decoration-white">{m[1]}</Link>
        : <a key={`${key}-${i++}`} href={href} rel="noopener" className="underline underline-offset-2">{m[1]}</a>);
    } else if (m[3]) out.push(<strong key={`${key}-${i++}`} className="font-semibold text-slate-900 dark:text-white">{m[3]}</strong>);
    else out.push(<em key={`${key}-${i++}`}>{m[4]}</em>);
    last = re.lastIndex;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

export default function BlogBody({ blocks }: { blocks: string[] }) {
  const nodes: React.ReactNode[] = [];
  let list: string[] = [];
  const flush = (k: number) => {
    if (!list.length) return;
    nodes.push(<ul key={`ul-${k}`} className="list-disc pl-6 space-y-1.5">{list.map((li, j) => <li key={j}>{inline(li, `li-${k}-${j}`)}</li>)}</ul>);
    list = [];
  };
  blocks.forEach((b, k) => {
    if (b.startsWith("- ")) { list.push(b.slice(2)); return; }
    flush(k);
    if (b.startsWith("### ")) nodes.push(<h3 key={k} className="text-lg font-semibold text-slate-900 dark:text-white pt-2">{inline(b.slice(4), `h3-${k}`)}</h3>);
    else if (b.startsWith("## ")) nodes.push(<h2 id={headingId(b.slice(3), k)} key={k} className="scroll-mt-24 text-2xl font-bold text-slate-900 dark:text-white pt-4">{inline(b.slice(3), `h2-${k}`)}</h2>);
    else if (b.startsWith("> ")) nodes.push(<p key={k} className="border-l-4 border-amber-400 bg-amber-50 dark:bg-slate-900 px-4 py-3 rounded-r-lg">{inline(b.slice(2), `q-${k}`)}</p>);
    else nodes.push(<p key={k}>{inline(b, `p-${k}`)}</p>);
  });
  flush(blocks.length);
  return <div className="mt-8 space-y-4 text-slate-700 dark:text-slate-300 leading-relaxed">{nodes}</div>;
}
