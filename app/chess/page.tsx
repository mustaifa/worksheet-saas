import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ChessGame from "@/components/chess/ChessGame";

export const metadata: Metadata = {
  title: "Play Chess Online — Free, No Sign-Up",
  description: "Play chess against the computer at four levels or with a friend on the same device. Full rules, hints, undo and move notation. Free, no ads, no account needed.",
  alternates: { canonical: "/chess" },
};

const TIPS = [
  { t: "Control the centre", d: "Pieces in the middle of the board reach more squares. Open with a centre pawn and bring out your knights and bishops early." },
  { t: "Keep your king safe", d: "Castle in the first ten moves if you can. It tucks the king away and brings a rook into the game." },
  { t: "Check before you move", d: "Ask what your opponent's last move threatens, and whether the square you are moving to is defended." },
  { t: "Learn from the notation", d: "The move list uses standard chess notation: N knight, B bishop, R rook, Q queen, K king, x for a capture, + for check and # for checkmate." },
];

export default function ChessPage() {
  return (
    <>
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Chess</h1>
        <p className="mt-2 mb-6 text-slate-600 dark:text-slate-300 max-w-2xl">
          Play the computer or a friend. All the rules are built in, including castling, en passant, pawn promotion and draws. Free, with no ads and no account needed.
        </p>
        <ChessGame />

        <section className="mt-12">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Tips for new players</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {TIPS.map((tip) => (
              <div key={tip.t} className="rounded-xl border border-slate-200 dark:border-slate-800 p-4">
                <h3 className="font-semibold text-slate-900 dark:text-white">{tip.t}</h3>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{tip.d}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
