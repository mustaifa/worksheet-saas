import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "About | Practice Sheet",
  description: "Why Practice Sheet exists and how it generates verified worksheets for grades 1-12.",
};

export default function About() {
  return (
    <main>
      <Navbar />
      <section className="max-w-2xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold">About Practice Sheet</h1>
        <div className="prose prose-slate mt-6 text-slate-700 space-y-4 leading-relaxed">
          <p>
            Practice Sheet started with a simple frustration teachers and parents know well:
            finding good, accurate practice worksheets takes longer than it should — and a lot
            of what's freely available online has typos, mismatched answer keys, or content
            that doesn't quite match grade level.
          </p>
          <p>
            So we built a generator instead of a library. Every worksheet is created on the
            spot from verified logic — math problems are computed, not guessed; English and
            Science questions come from curated, fact-checked banks — so the answer key is
            always right, every time, for every grade from 1 to 12.
          </p>
          <p>
            The goal is simple: give teachers, parents, and students a fast, reliable way to
            get extra practice material without second-guessing whether the answers are correct.
          </p>
          <p>
            We're just getting started — more subjects, more topics, and more classroom tools
            are on the way. If there's something you wish existed, <a href="/contact" className="text-slate-900 underline">tell us</a>.
          </p>
        </div>
      </section>
      <Footer />
    </main>
  );
}
